import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPosts, getLikesPost, getUserPost, LikedUnLikedPost } from '../controllers/post.controiller.js';

const router = express.Router();

router.post("/all",protectedRoute, getAllPost);
router.post("/following",protectedRoute, getFollowingPosts);
router.post("/user/:username",protectedRoute, getUserPost);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, LikedUnLikedPost);
router.post("/likes/:id",protectedRoute,getLikesPost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.post("/", protectedRoute, deletePost);



export default router;