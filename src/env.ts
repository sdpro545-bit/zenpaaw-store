import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().default('admin@zenpaaw.com'),
  ADMIN_PASSWORD: z.string().min(8).default('ZenPaaw_Secure_Admin_2026!'),
  SESSION_SECRET: z.string().min(32).default('zenpaaw_super_secret_jwt_cookie_encryption_key_2026'),
  PAYMENT_PROVIDER: z.enum(['stripe', 'paystack']).default('stripe'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment variable validation failed:', parsed.error.format());
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables in production');
  }
}

export const env = parsed.success ? parsed.data : envSchema.parse({});
export default env;
