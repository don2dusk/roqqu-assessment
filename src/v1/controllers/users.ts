import { Request, Response, NextFunction } from "express";
import { NotFoundError, BadRequestError } from "../errors/errors";
import { prisma } from "../../config/db";
import { paginateHelper } from "../pagination/pagination";
import {
  checkUserUniqueness,
  userValidator,
} from "../validators.ts/user_validator";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { pageNumber = 1, pageSize = 10 } = req.query;
  try {
    const { skip, take, totalCount, totalPages } = await paginateHelper(
      pageNumber as string,
      pageSize as string,
      "user"
    );

    const userQuery = await prisma.user.findMany({
      skip,
      take,
      select: { name: true, email: true, id: true },
    });

    res.status(200).json({
      message: "Users fetched successfully",
      data: {
        users: userQuery,
        totalCount,
        totalPages,
        currentPage: parseInt(pageNumber as string, 10),
        pageSize: parseInt(pageSize as string, 10),
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const countTotalUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await prisma.user.count();
    res.status(200).json({ message: "Total users", count });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = userValidator.safeParse(req.body);
    if (!parsedData.success) {
      throw new BadRequestError("Validation Failed", parsedData.error.errors);
    }

    const { name, email, username } = parsedData.data;

    await checkUserUniqueness(username, email);

    const user = await prisma.user.create({
      data: { name, email, username },
    });

    res.status(201).json({
      message: "User added successfully",
      user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
