import { NextResponse } from 'next/server';
import { verifyAdminSession, ADMIN_COOKIE_CONFIG } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await verifyAdminSession(req);
  const response = NextResponse.json({
    success: true,
    authenticated: session.authenticated,
    message: 'Logged out successfully',
  });
  response.cookies.set(ADMIN_COOKIE_CONFIG.name, '', {
    ...ADMIN_COOKIE_CONFIG.options,
    maxAge: 0,
  });
  return response;
}
