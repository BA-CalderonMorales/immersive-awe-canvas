
import { z } from 'zod';

// GitHub issue validation schema
export const githubIssueSchema = z.object({
  issueLocation: z.string()
    .min(1, 'Issue location is required')
    .max(500, 'Issue location must be less than 500 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Invalid characters in issue location'),
  
  device: z.array(z.string())
    .min(1, 'At least one device must be selected')
    .max(10, 'Too many devices selected'),
  
  inUS: z.enum(['yes', 'no'], {
    required_error: 'Please specify if you are in the US',
  }),
  
  frequency: z.enum(['always', 'sometimes', 'rarely'], {
    required_error: 'Frequency is required',
  }),
  
  expectedBehavior: z.string()
    .min(10, 'Expected behavior must be at least 10 characters')
    .max(2000, 'Expected behavior must be less than 2000 characters'),
  
  workaround: z.string()
    .max(1000, 'Workaround must be less than 1000 characters')
    .optional(),
  
  canContact: z.enum(['yes', 'no'], {
    required_error: 'Contact consent is required',
  }),
  
  email: z.string()
    .email('Invalid email address')
    .optional(),
}).superRefine((data, ctx) => {
  // Email is required if canContact is 'yes'
  if (data.canContact === 'yes' && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Email is required when you consent to be contacted',
      path: ['email'],
    });
  }
});

// Scene settings validation schema
import { HEX_COLOR_REGEX } from './utils';

export const sceneSettingsSchema = z.object({
  mainObjectColor: z.string()
    .regex(HEX_COLOR_REGEX, 'Invalid color format'),
  
  material: z.object({
    materialType: z.enum(['standard', 'physical', 'toon', 'lambert', 'phong', 'normal', 'basic', 'matcap']).optional(),
    wireframe: z.boolean().optional(),
    roughness: z.number().min(0).max(1).optional(),
    metalness: z.number().min(0).max(1).optional(),
    emissive: z.string().regex(HEX_COLOR_REGEX).optional(),
    emissiveIntensity: z.number().min(0).max(10).optional(),
    transparent: z.boolean().optional(),
    opacity: z.number().min(0).max(1).optional(),
  }),
  
  background: z.object({
    type: z.enum(['sky', 'stars', 'fog', 'sparkles', 'color', 'environment', 'gradient', 'noise', 'plasma', 'void', 'aurora']),
    // Add more specific validation based on background type
  }),
});

// Generic text input sanitization
export const sanitizeText = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .slice(0, 10000); // Limit length
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};
