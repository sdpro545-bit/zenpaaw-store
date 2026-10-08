import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Default admin credentials: admin@zenpaaw.com / zenpaaw2026
    if (
      (email === 'admin@zenpaaw.com' || email === 'admin') &&
      (password === 'zenpaaw2026' || password === 'admin')
    ) {
      return NextResponse.json({
        success: true,
        token: 'zenpaaw_admin_session_token_' + Date.now(),
        user: { name: 'ZenPaaw Store Admin', email: 'admin@zenpaaw.com' }
      });
    }

    return NextResponse.json(
      { error: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
