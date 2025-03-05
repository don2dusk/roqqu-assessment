import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { addressValidator } from "../validators.ts/user_validator";

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userID } = req.params;
  try {
    const address = await prisma.user.findFirst({
      where: {
        id: userID,
      },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });

    if (!address)
      throw new NotFoundError("User with this UserID does not exist!");

    if (address?.address === null)
      throw new NotFoundError("No address found for this user");

    res.status(200).json({
      message: "Address fetched successfully",
      user: {
        id: address.id,
        name: address.name,
        address: address.address,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userID, address } = req.body;
  try {
    const parsedData = addressValidator.safeParse(address);
    if (!parsedData.success) {
      throw new BadRequestError("Validation Failed", parsedData.error.errors);
    }
    const user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        address: address,
      },
    });

    res.status(200).json({
      message: "Address added successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userID } = req.params;
  const { address } = req.body;
  try {
    const parsedData = addressValidator.safeParse(address);
    if (!parsedData.success) {
      throw new BadRequestError("Validation Failed", parsedData.error.errors);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        address: address,
      },
    });

    res.status(200).json({
      message: "Address updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
