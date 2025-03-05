import { z } from "zod";

export const postValidator = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(250),
  userId: z.string().min(1),
});
