import { z } from 'zod';

/**
 * OWASP A05: Environment Variable Validation Schema
 * Validates critical environment variables on startup to prevent insecure defaults or missing secrets.
 */
const EnvSchema = z.object({
  PORT: z.string().optional().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET là bắt buộc và không được để trống' }).min(16, 'JWT_SECRET phải dài ít nhất 16 ký tự để bảo mật'),
  DATABASE_URL: z.string().optional(),
});

export function validateEnvironment(): z.infer<typeof EnvSchema> {
  const parseResult = EnvSchema.safeParse(process.env);
  if (!parseResult.success) {
    console.error('❌ CRITICAL SECURITY ERROR: Environment Variable Validation Failed!');
    console.error(parseResult.error.format());
    process.exit(1);
  }
  return parseResult.data;
}
