import { z } from 'zod';

// Only NEXT_PUBLIC_* vars are readable in the browser — anything the client
// needs (API base URL, socket URL) has to be prefixed that way.
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:5000/api'),
  NEXT_PUBLIC_SOCKET_URL: z.string().default('http://localhost:5000'),
});

export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
});
