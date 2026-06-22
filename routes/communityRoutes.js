import express from "express";
import {
  addPostComment,
  addVideoComment,
  createPost,
  getPostById,
  getPosts,
  getVideoById,
  getVideos,
  likePost,
  likeVideo,
  uploadVideo,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/posts", getPosts);
router.get("/post/:id", getPostById);
router.post("/post/create", createPost);
router.post("/post/comment", addPostComment);
router.post("/post/like", likePost);

router.get("/videos", getVideos);
router.get("/video/:id", getVideoById);
router.post("/video/upload", uploadVideo);
router.post("/video/like", likeVideo);
router.post("/video/comment", addVideoComment);

export default router;
