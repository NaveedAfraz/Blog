const express = require("express");
const {
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addPost,
  getuserPosts,
} = require("../controller/post.js")
const router = express.Router();
router.get("/:id", getPost);
router.get("/", getPosts);
router.put("/:id", updatePost);
router.delete("/deletePost/:id", deletePost);
router.post("/addPost", addPost);

module.exports = router;
