import { z } from 'zod';

export const CreateInvitationSchema = z.object({
  email: z.string().email(),
});
