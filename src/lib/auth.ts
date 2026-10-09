import { SignJWT, jwtVerify } from 'jose';
import crypto from 'node:crypto';
import { env } from '@/env';

const COOKIE_NAME = 'zenpaaw_admin_session';
const SECRET_KEY = new TextEncoder().encode(env.SESSION_SECRET);

export interface AdminSessionUser {
  email: string;
  role: 'admin';
}

// In-memory token bucket rate limiter for admin login attempts
interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(identifier: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    loginAttempts.set(identifier, { attempts: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset window after 15 minutes
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(identifier, { attempts: 1, lastAttempt: now });
    return { allowed: true };
  }

  if (record.attempts >= 5) {
    const waitMinutes = Math.ceil((15 * 60 * 1000 - (now - record.lastAttempt)) / 60000);
    return { allowed: false, waitMinutes };
  }

  record.attempts += 1;
  record.lastAttempt = now;
  return { allowed: true };
}

export function resetLoginRateLimit(identifier: string) {
  loginAttempts.delete(identifier);
}

// Constant-time password comparison to prevent timing attacks
export function verifyPassword(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    // Constant time dummy compare
    crypto.timingSafeEqual(providedBuffer, providedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

// Create signed JWT session token
export async function createAdminToken(user: AdminSessionUser): Promise<string> {
  return await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

// Verify signed JWT session token
export async function verifyAdminToken(token: string): Promise<AdminSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    if (payload.email && payload.role === 'admin') {
      return {
        email: payload.email as string,
        role: 'admin',
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Verify session from an incoming Next.js API Request
export async function verifyAdminSession(req: Request): Promise<{ authenticated: boolean; user?: AdminSessionUser }> {
  // Check Cookie header
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) {
    return { authenticated: false };
  }

  const user = await verifyAdminToken(token);
  if (!user) {
    return { authenticated: false };
  }

  return { authenticated: true, user };
}

export const ADMIN_COOKIE_CONFIG = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
