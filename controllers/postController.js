import Post from "../models/Post.js";
import ActivityLog from "../models/ActivityLog.js";
import PostUpdateLog from "../models/PostUpdateLog.js";


// create post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(post,{message: "Post created Successfully."});
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// get all the Posts

export const getAllPosts = async(_req, res) =>{
    try {
        const posts = await Post.find()
      .populate("author", "name email role")
      .populate("likes", "name email");

    res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// ✅ Get posts created by the logged-in user
export const getOwnPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate(
      "author",
      "name email role"
    );
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// Get update history for a post (only post owner + admin can see)
export const getUpdates = async (req, res) => {
  try {
    const logs = await PostUpdateLog.find({ post: req.params.id })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// update the posts
// Update Post
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Permission check
    if (
      post.author.toString() !== req.user._id.toString() &&
      !["author", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Capture old data for comparison
    const oldPost = { title: post.title, content: post.content };

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    // Save activity log (admin dashboard)
    await ActivityLog.create({
      action: "update",
      post: post._id,
      user: req.user._id,
      role: req.user.role
    });

    // Save update log (for post owner transparency)
    const changes = {};
    if (title && title !== oldPost.title) {
      changes.title = { old: oldPost.title, new: title };
    }
    if (content && content !== oldPost.content) {
      changes.content = { old: oldPost.content, new: content };
    }

    if (Object.keys(changes).length > 0) {
      await PostUpdateLog.create({
        post: post._id,
        updatedBy: req.user._id,
        role: req.user.role,
        changes
      });
    }

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Delete post
// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      !["author", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    // Save activity log (admin dashboard)
    await ActivityLog.create({
      action: "delete",
      post: post._id,
      user: req.user._id,
      role: req.user.role
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Like/Unlike post.
export const LikeDislikePost = async (req,res) =>{
    try {
        const { id } = req.params;
        let post = await Post.findById(id);
        if(!post) return res.status(404).json({message: "Post not found."});
        const userId = req.user._id;
        
        if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post,{messge:"Like or dislike."});
    } catch (error) {
        res.status(500).json({
            messagae: "Server Error",
            error: error.message
        })
    }
}