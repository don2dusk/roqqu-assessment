import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { postValidator } from "../validators.ts/post_validator";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.query.userId;
  try {
    if (!userId && userId === "")
      throw new BadRequestError("User ID is required");

    const userVerify = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });

    if (!userVerify) throw new NotFoundError("User not found");

    const posts = await prisma.post.findMany({
      where: {
        userId: userId as string,
      },
    });
    res.status(200).json({
      message: "All user posts retrieved successfully",
      posts,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, userId } = req.body;

    const parsedData = postValidator.safeParse(req.body);
    if (!parsedData.success) {
      throw new BadRequestError("Validation Failed", parsedData.error.errors);
    }

    const userVerify = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userVerify) throw new NotFoundError("User not found");

    const post = await prisma.post.create({
      data: {
        title,
        body,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    if (!id && id === "") throw new BadRequestError("Post ID is required");

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) throw new NotFoundError("Post not found");

    await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
