import express from "express";
import { createPostByUser, getPostByUser, getPostsByUser, updatePostByUser, deletePostByUser } from "../controllers/postController"
import { authMiddleware } from "./../middleware/auth"
const router = express.Router();


// CRUD för en resurs posts
router.post("/", authMiddleware, createPostByUser);
router.get("/", authMiddleware, getPostsByUser);
router.get("/:postId", authMiddleware, getPostByUser);
router.put("/:postId", authMiddleware, updatePostByUser);
router.delete("/:postId", authMiddleware, deletePostByUser);

export default router;


