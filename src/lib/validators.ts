import { z } from 'zod';
import { VALIDATION_PATTERNS } from './constants';

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(
      VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`
    ),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(
      VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`
    ),
  name: z.string().min(1, 'Name is required'),
});

// Site validation schemas - matching backend exactly
export const createSiteSchema = z.object({
  name: z
    .string()
    .min(1, 'Site name is required')
    .max(100, 'Site name must be less than 100 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(
      VALIDATION_PATTERNS.URL,
      'Please enter a valid URL (including http:// or https://)'
    ),
  description: z.string().optional(),
});

// API response validation schemas - matching backend exactly
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
  subscription_tier: z.enum(['free', 'pro', 'enterprise']).optional(),
});

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    is_active: z.boolean(),
    subscription_tier: z.enum(['free', 'pro', 'enterprise']).optional(),
  }),
  token: z.string(),
  expires_in: z.number(),
});

export const siteSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
  embedding_status: z.enum([
    'not_started',
    'in_progress',
    'completed',
    'failed',
  ]),
  last_embedding_at: z.string().optional(),
  post_count: z.number(),
  chunk_count: z.number(),
});

export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

// Helper function to validate data with better error handling
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// Type exports
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type CreateSiteSchema = z.infer<typeof createSiteSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type AuthResponseSchema = z.infer<typeof authResponseSchema>;
export type SiteSchema = z.infer<typeof siteSchema>;
