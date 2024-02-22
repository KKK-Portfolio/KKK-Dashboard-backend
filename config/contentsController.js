const Contents = require("../model/contentsModel");
const contentsMiddleware = require("../middleware/contentsMiddleware");

// Create a new post
exports.createPost = async (req, res) => {
  res.status(200).json("message : Success");
};
// contentsMiddleware.array("images", 1),
// async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const images = req.files.map((file) => ({
//       filename: file.filename,
//       path: file.path,
//     }));
//     const post = new Contents({ title, description, images });
//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating post", error: error });
//   }
// };

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Contents.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Contents.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error });
  }
};

// Update post by ID
exports.updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await Contents.findByIdAndUpdate(
      req.params.id,
      { title, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error });
  }
};

// Delete post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Contents.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error });
  }
};
