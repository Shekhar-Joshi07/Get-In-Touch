import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: [],
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* UPDATE */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, picturePath } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { description, picturePath },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments.userId").populate("likes.userId");
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).populate("comments.userId").populate("likes.userId");
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    // Find the index of the like object with matching userId
    const likeIndex = post.likes.findIndex((like) => like.userId.toString() === userId);

    if (likeIndex > -1) {
      // If the like exists, remove it from the array
      post.likes.splice(likeIndex, 1);
    } else {
      // If the like doesn't exist, add it to the array
      post.likes.push({ userId });
    }

    const updatedPost = await post.save();

    // Populate the user information in the likes
    await updatedPost.populate({ path: "likes.userId", model: "User" }).execPopulate();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      comment,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the user information in the comment
    await post
      .populate({ path: "comments.userId", model: "User" })
      
  
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
