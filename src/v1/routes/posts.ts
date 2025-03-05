import Express from "express";
import { createPost, deletePost, getPosts } from "../controllers/posts";

const router = Express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);

export default router;
