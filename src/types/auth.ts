import { z } from 'zod';

export const LoginPayloadSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
