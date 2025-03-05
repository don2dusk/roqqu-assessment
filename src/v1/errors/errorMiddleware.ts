import { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "./errors";
import {
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const errorHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response<any, Record<string, any>> | undefined => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors || [],
      success: false,
    });
  }
  if (err instanceof Error) {
    let message = "";
    if (err instanceof PrismaClientValidationError) {
      message += "Could not store data in the database";
    } else if (err instanceof PrismaClientInitializationError) {
      message += "Could not access database";
    } else {
      message += err.message;
    }
    return res.status(500).json({
      message,
      statusCode: 500,
    });
  }
};
