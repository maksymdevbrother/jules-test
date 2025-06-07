import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import db from '../../../../database/db'; // Adjust path as necessary

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // This should ideally not happen if your environment is set up correctly
  console.error('JWT_SECRET is not defined. API cannot function.');
  // In a real app, you might have more robust error handling or startup checks
}

const secret = new TextEncoder().encode(JWT_SECRET || 'fallback-secret'); // Fallback for safety, but env var should be set

export async function GET(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json({ message: 'Server configuration error: JWT secret missing' }, { status: 500 });
  }

  const tokenCookie = request.cookies.get('token');

  if (!tokenCookie) {
    return NextResponse.json({ message: 'Authentication token not found' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    const { payload } = await jose.jwtVerify(token, secret) as { payload: jose.JWTPayload & { userId: number, username: string } };

    // Optionally, you could re-fetch user from DB to ensure they still exist/are active
    // For this example, we'll trust the JWT payload if verification passes.
    const user = {
      id: payload.userId,
      username: payload.username,
    };

    // It's good practice to also return the token if it's still valid and you want the client to have it
    // (e.g., if it was refreshed or if the client needs to pass it in headers for other non-cookie based APIs)
    // However, for an HttpOnly cookie setup, the client primarily relies on the cookie being present.
    // Sending it back in the /me response can be useful for debugging or if the client AuthContext wants to store it.
    return NextResponse.json({ user, token }, { status: 200 });

  } catch (error) {
    // Handle different JWT errors specifically if needed (e.g., TokenExpiredError, JWSInvalidError)
    console.error('JWT verification error:', error);

    // Clear the invalid cookie
    const response = NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });
    return response;
  }
}
