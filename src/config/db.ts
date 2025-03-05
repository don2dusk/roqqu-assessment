import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;
declare global {
  var db: PrismaClient | undefined;
}
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma
    .$connect()
    .then(() => {
      console.log("Db Connected");
    })
    .catch(() => {
      console.log("Failed to connect in production");
    });
} else {
  global.db = global.db ?? new PrismaClient();
  global.db
    .$connect()
    .then(() => {
      console.log("Db Connected");
    })
    .catch(() => {
      console.log("Failed to connect in cache");
    });
  prisma = global.db;
}
export { prisma };
