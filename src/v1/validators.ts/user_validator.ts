import { z } from "zod";
import { prisma } from "../../config/db";
import { BadRequestError } from "../errors/errors";

export const userValidator = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username should be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters"),
  email: z.string().email("Invalid email format"),
});

export const addressValidator = z.string().min(1, "Address is required");

export const checkUserUniqueness = async (username: string, email: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new BadRequestError("Username is already taken");
    }
    if (existingUser.email === email) {
      throw new BadRequestError("Email is already taken");
    }
  }
};
