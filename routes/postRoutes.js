import express from "express";
import {
  createPost,
  getAllPosts,
  getOwnPosts,
  getUpdates,
  updatePost,
  deletePost,
  LikeDislikePost
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// CRUD
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id/updates",getUpdates);
router.get("/my-posts",getOwnPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

// Like/Unlike
router.put("/:id/like", LikeDislikePost);

export default router;
