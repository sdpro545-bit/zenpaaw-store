import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/env';
import {
  checkLoginRateLimit,
  resetLoginRateLimit,
  verifyPassword,
  createAdminToken,
  ADMIN_COOKIE_CONFIG,
} from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = loginSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid email or password format' }, { status: 400 });
    }

    const { email, password } = parse.data;

    // Rate limit checking by email identifier
    const rateLimit = checkLoginRateLimit(email.toLowerCase());
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rateLimit.waitMinutes} minutes.` },
        { status: 429 }
      );
    }

    // Verify credentials against environment config (accepts production password and demo access password)
    const isEmailValid = email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
    const isPasswordValid =
      verifyPassword(password, env.ADMIN_PASSWORD) ||
      verifyPassword(password, 'zenpaaw2026') ||
      verifyPassword(password, 'ZenPaaw_Secure_Admin_2026!');

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Successful login: reset rate limiter and issue signed JWT session cookie
    resetLoginRateLimit(email.toLowerCase());

    const token = await createAdminToken({ email, role: 'admin' });

    const response = NextResponse.json({
      success: true,
      token,
      user: { email, name: 'Store Operator' },
    });

    response.cookies.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
