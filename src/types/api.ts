import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
  }),
});

export type User = z.infer<typeof UserSchema>;

export const UsersResponseSchema = z.array(UserSchema);
