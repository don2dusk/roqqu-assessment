import Express from "express";
import UserRouter from "./users";
import PostRouter from "./posts";
import AddressRouter from "./addresses";

const router = Express.Router();

router.get("/", (_req, res) => {
  res.json({
    message:
      "Welcome to this Roqqu Assessment API. Please refer to the Postman docs using the link below.",
    docs_link: "https://documenter.getpostman.com/view/25022077/2sAYdkHpMZ",
    success: true,
  });
});

router.use("/users", UserRouter);
router.use("/posts", PostRouter);
router.use("/addresses", AddressRouter);

export default router;
