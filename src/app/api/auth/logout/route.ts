import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0), // Set expiration date to the past
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'An error occurred during logout' }, { status: 500 });
  }
}
