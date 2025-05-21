import { z } from 'zod';

const positionEnum = z.enum(['Admin', 'Developer', 'Manager', 'Team Lead', 'Beneficiary']);
const genderEnum = z.enum(['Male', 'Female', 'Other']);

const baseUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters'),
  email: z.string()
    .email('Invalid email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  position: positionEnum,
});

export const registerSchema = baseUserSchema.extend({
  gender: z.string().optional(),
  programme: z.string().optional(),
  cohortStartDate: z.coerce.date().optional(),  // Accepts string or Date
  cohortEndDate: z.coerce.date().optional(),
}).superRefine((data, ctx) => {
  if (data.position === 'Beneficiary') {
    if (!data.gender || !genderEnum.safeParse(data.gender).success) {
      ctx.addIssue({
        path: ['gender'],
        code: z.ZodIssueCode.custom,
        message: 'Gender is required and must be one of: Male, Female, Other',
      });
    }

    if (!data.programme) {
      ctx.addIssue({
        path: ['programme'],
        code: z.ZodIssueCode.custom,
        message: 'Programme is required for beneficiaries',
      });
    }

    if (!data.cohortStartDate) {
      ctx.addIssue({
        path: ['cohortStartDate'],
        code: z.ZodIssueCode.custom,
        message: 'Cohort start date is required for beneficiaries',
      });
    }

    if (!data.cohortEndDate) {
      ctx.addIssue({
        path: ['cohortEndDate'],
        code: z.ZodIssueCode.custom,
        message: 'Cohort end date is required for beneficiaries',
      });
    }

    if (data.cohortStartDate && data.cohortEndDate && data.cohortEndDate < data.cohortStartDate) {
      ctx.addIssue({
        path: ['cohortEndDate'],
        code: z.ZodIssueCode.custom,
        message: 'Cohort end date must be after start date',
      });
    }
  }
});
