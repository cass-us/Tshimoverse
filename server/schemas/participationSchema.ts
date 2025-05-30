import { z } from 'zod';

export const EnrollSchema = z.object({
  beneficiaryId: z.string(),
  programId: z.string(),
  role: z.enum(['participant', 'mentor', 'facilitator']).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});
