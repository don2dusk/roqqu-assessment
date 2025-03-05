import express, { ErrorRequestHandler } from "express";
import http from "http";
import dotenv from "dotenv";
import { NotFoundError } from "./v1/errors/errors";
import { errorHandler } from "./v1/errors/errorMiddleware";
import ApiRouter from "./v1/routes/index";

const app = express();
const server = http.createServer(app);
dotenv.config();

app.use(express.json());
app.use("/api/v1", ApiRouter);
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  next(new NotFoundError(`invalid route! ${req.url}`));
});
app.use(errorHandler as ErrorRequestHandler);

export default app;
