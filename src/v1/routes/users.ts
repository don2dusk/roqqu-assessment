import Express from "express";
import {
  addUser,
  countTotalUsers,
  getUserById,
  getUsers,
} from "../controllers/users";

const router = Express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/count", countTotalUsers);
router.post("/add", addUser);

export default router;
