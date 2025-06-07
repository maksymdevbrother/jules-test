import db from '../../../../database/db';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in your environment variables. Please add it to .env.local');
}

const secret = new TextEncoder().encode(JWT_SECRET);
const alg = 'HS256';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as { id: number; username: string; password: string } | undefined;

    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const token = await new jose.SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(secret);

    const response = NextResponse.json({ message: 'Login successful', token }, { status: 200 });

    // Set HttpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
