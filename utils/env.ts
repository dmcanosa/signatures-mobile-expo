/**
 * Environment Validation for React Native
 * Ensures all required environment variables are set at startup
 */

import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),
});

export type Environment = z.infer<typeof envSchema>;

let validatedEnv: Environment | null = null;

/**
 * Validate and get environment variables
 * Should be called once at application startup
 */
export function validateEnv(): Environment {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse({
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    });
    console.log('✅ Environment variables validated');
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      console.error('❌ Environment validation failed:\n', missingVars);
      throw new Error(`Invalid environment configuration:\n${missingVars}`);
    }
    throw error;
  }
}
