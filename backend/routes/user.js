const multer = require("multer");
const express = require("express");
const {
  updateuserdetails,
  getuserPosts,
  updateDetails,
  details,
} = require("../controller/user");
// const path = require("path");
// const fs = require("fs");
const router = express.Router();

// Route to handle image uplo

// Route to handle user update (PUT request)
router.put("/userBlog/:id", updateuserdetails);
router.get("/userBlog/:id", getuserPosts);
router.put("/updateDetails/:id", updateDetails);
router.get("/details/:id",details) 
module.exports = router;
