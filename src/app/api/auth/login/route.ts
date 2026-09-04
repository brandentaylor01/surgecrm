import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 🔒 Master Credentials
    const ADMIN_USERNAME = "branden@hirerainmakers.com";
    const ADMIN_PASSWORD = "Rainmaker365!"; 

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: "Authentication successful" });
      
      // Set a secure server-side session cookie valid for 24 hours
      response.cookies.set('admin_session', 'authenticated_token_98321', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
