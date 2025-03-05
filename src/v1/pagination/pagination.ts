import { prisma } from "../../config/db";
import { BadRequestError } from "../errors/errors";

export const paginateHelper = async (
  pageNumber: string,
  pageSize: string,
  modelName: string,
  where?: object
) => {
  const page = parseInt(pageNumber, 10);
  const limit = parseInt(pageSize, 10);

  if (isNaN(page) || page < 1) {
    throw new BadRequestError("Invalid page number");
  }

  if (isNaN(limit) || limit < 1) {
    throw new BadRequestError("Invalid page size");
  }

  const skip = (page - 1) * limit;
  const take = limit;

  const totalCount = await (
    prisma[modelName as keyof typeof prisma] as any
  ).count({
    where,
  });

  const totalPages = Math.ceil(totalCount / limit);

  return { skip, take, totalCount, totalPages };
};
