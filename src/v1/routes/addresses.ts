import Express from "express";
import {
  addAddress,
  getAddress,
  updateAddress,
} from "../controllers/addresses";

const router = Express.Router();

router.get("/:userID", getAddress);
router.post("/", addAddress);
router.patch("/:userID", updateAddress);

export default router;
