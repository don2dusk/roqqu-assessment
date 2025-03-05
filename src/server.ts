import app from "./app";
import { prisma } from "./config/db";

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});
