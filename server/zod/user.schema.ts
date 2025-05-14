import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  position: z.enum(['BI', 'Developer', 'Manager', 'Team Lead']),
});


export type RegisterInput = z.infer<typeof registerSchema>;
