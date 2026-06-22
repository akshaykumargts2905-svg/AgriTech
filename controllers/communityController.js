import api from "../prisma/config/prisma.js";
import { addRewardPoints } from "./rewardController.js";

export const createPost = async (req, res) => {
  try {
    const { farmerId, title, content, imageUrl, videoUrl } = req.body;
    const farmerIdNumber = Number(farmerId);

    if (!farmerIdNumber || !title || !content) {
      return res.status(400).json({
        error: "farmerId, title, and content are required",
      });
    }

    const post = await api.communityPost.create({
      data: {
        farmerId: farmerIdNumber,
        title,
        content,
        imageUrl,
        videoUrl,
      },
    });

    await addRewardPoints({
      farmerId: farmerIdNumber,
      points: 5,
      reason: "Created community post",
      referenceType: "COMMUNITY_POST",
      referenceId: post.postId,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPosts = async (_req, res) => {
  try {
    const posts = await api.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        farmer: {
          select: { id: true, name: true, state: true, country: true },
        },
        comments: true,
        likes: true,
      },
    });

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await api.communityPost.findUnique({
      where: { postId: req.params.id },
      include: {
        farmer: {
          select: { id: true, name: true, state: true, country: true },
        },
        comments: {
          include: {
            farmer: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const addPostComment = async (req, res) => {
  try {
    const { postId, farmerId, comment } = req.body;
    const farmerIdNumber = Number(farmerId);

    if (!postId || !farmerIdNumber || !comment) {
      return res.status(400).json({
        error: "postId, farmerId, and comment are required",
      });
    }

    const newComment = await api.communityComment.create({
      data: {
        postId,
        farmerId: farmerIdNumber,
        comment,
      },
    });

    await addRewardPoints({
      farmerId: farmerIdNumber,
      points: 2,
      reason: "Commented on community post",
      referenceType: "COMMUNITY_COMMENT",
      referenceId: newComment.commentId,
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId, farmerId } = req.body;
    const farmerIdNumber = Number(farmerId);

    if (!postId || !farmerIdNumber) {
      return res.status(400).json({ error: "postId and farmerId are required" });
    }

    const like = await api.communityLike.upsert({
      where: {
        postId_farmerId: {
          postId,
          farmerId: farmerIdNumber,
        },
      },
      update: {},
      create: {
        postId,
        farmerId: farmerIdNumber,
      },
    });

    return res.status(201).json({
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to like post" });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    const { farmerId, title, description, videoUrl, thumbnailUrl, category } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ error: "title and videoUrl are required" });
    }

    const video = await api.video.create({
      data: {
        farmerId: farmerId ? Number(farmerId) : null,
        title,
        description,
        videoUrl,
        thumbnailUrl,
        category,
      },
    });

    if (farmerId) {
      await addRewardPoints({
        farmerId: Number(farmerId),
        points: 10,
        reason: "Uploaded learning video",
        referenceType: "VIDEO",
        referenceId: video.videoId,
      });
    }

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload video" });
  }
};

export const getVideos = async (_req, res) => {
  try {
    const videos = await api.video.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        comments: true,
        likes: true,
      },
    });

    return res.json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await api.video.findUnique({
      where: { videoId: req.params.id },
      include: {
        comments: {
          include: {
            farmer: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: true,
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.json(video);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch video" });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const { videoId, farmerId } = req.body;
    const farmerIdNumber = Number(farmerId);

    if (!videoId || !farmerIdNumber) {
      return res.status(400).json({ error: "videoId and farmerId are required" });
    }

    const like = await api.videoLike.upsert({
      where: {
        videoId_farmerId: {
          videoId,
          farmerId: farmerIdNumber,
        },
      },
      update: {},
      create: {
        videoId,
        farmerId: farmerIdNumber,
      },
    });

    return res.status(201).json({
      message: "Video liked successfully",
      like,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to like video" });
  }
};

export const addVideoComment = async (req, res) => {
  try {
    const { videoId, farmerId, comment } = req.body;
    const farmerIdNumber = Number(farmerId);

    if (!videoId || !farmerIdNumber || !comment) {
      return res.status(400).json({
        error: "videoId, farmerId, and comment are required",
      });
    }

    const newComment = await api.videoComment.create({
      data: {
        videoId,
        farmerId: farmerIdNumber,
        comment,
      },
    });

    await addRewardPoints({
      farmerId: farmerIdNumber,
      points: 2,
      reason: "Commented on video",
      referenceType: "VIDEO_COMMENT",
      referenceId: newComment.commentId,
    });

    return res.status(201).json({
      message: "Video comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add video comment" });
  }
};
