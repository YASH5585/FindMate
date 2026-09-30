import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  status: z.enum(['lost', 'found'], {
    errorMap: () => ({ message: 'Status must be lost or found' }),
  }),
  category: z.enum(['electronics', 'id-card', 'bags', 'books', 'accessories', 'clothing', 'other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  description: z.string().min(1, 'Description is required').max(2000),
  location: z.string().min(1, 'Location is required').max(200),
  date: z.string().min(1, 'Date is required'),
  image: z.union([z.string().url('Image must be a valid URL'), z.null()]).optional().transform((v) => v ?? null),
  reporterName: z.string().min(1, 'Reporter name is required').max(100),
  contact: z.string().min(1, 'Contact is required').max(200),
});

export const ItemIdSchema = z.object({
  id: z.string().uuid('Invalid item id'),
});

export const ItemFiltersSchema = z.object({
  status: z.enum(['lost', 'found']).optional(),
  category: z.enum(['electronics', 'id-card', 'bags', 'books', 'accessories', 'clothing', 'other']).optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});
