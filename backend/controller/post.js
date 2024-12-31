const promisePool = require("../db.js");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
  const { cat } = req.query;
  //console.log(cat);

  if (!cat) {
    return res.status(400).json({ message: "Category not provided" });
  }

  promisePool
    .getConnection()
    .then(() => console.log("Database connection successful"))
    .catch((err) => {
      console.error("Database connection failed:", {
        message: err.message,
        stack: err.stack,
      });
    });

  const query =
    cat == "All" ? "SELECT * FROM posts" : "SELECT * FROM posts WHERE cat = ?";

  try {
    const [data] =
      cat === "home" || !cat
        ? await promisePool.execute(query)
        : await promisePool.execute(query, [cat]);
    if (data.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    return res
      .status(500)
      .json({ message: "Internal Server Error due to idk", error: err });
  }
};

const getPost = async (req, res) => {
  const { ID } = req.query;

  if (!ID) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const query =
    "SELECT p.id, u.username, p.title, p.desc, p.img AS postImg, u.username, p.cat, p.date, p.status FROM UserAuth u JOIN posts p ON u.id = p.userid WHERE p.id = ?";

  // console.log(ID);
  const [data] = await promisePool.execute(query, [ID]);
  return res.status(200).json(data);
};

const deletePost = (req, res) => {
  console.log(req.body);
  const ID = req.params.id;
  console.log("ID received for deletion:", ID);
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) return res.status(401).json("Not authenticated !");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(userInfo.id);

    const q = "DELETE FROM posts WHERE `id` = ? AND `userid` = ?";
    try {
      const [data] = await promisePool.execute(q, [ID, userInfo.id]);
      if (data.affectedRows === 0) {
        // return res.status(404).json("Post not found.");
        return res.status(403).json("you can delete your own post only");
      }
      // if(err){

      // }
      console.log("Post has been deleted!");
      return res.status(200).json("Post has been deleted!");
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json("An error occurred.");
    }
  });
};

const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  const data = req.body;
  console.log(data);

  // console.log(token);
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    // console.log(postId);
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? ,status = ? WHERE `id` = ? AND `userid` = ?";
    const { title, desc, file, img, date, cat, status } = req.body.postDetails;
    const values = [title, desc, img, cat, status, postId, userInfo.id];
    /* const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      // req.body.date,
      req.body.cat,
      req.body.status,
      postId,
      userInfo.id,
    ];*/
    console.log(req.body.postDetails);
    // console.log(values);
    // console.log("Query:", q);
    const [data] = await promisePool.execute(q, values);
    if (data.affectedRows === 0) {
      // return res.status(404).json("Post not found.");
      return res.status(404).json("error updating the post");
    }
    return res.status(200).json("post updated");
    //   db.query(q, [...values, postId, userInfo.id], (err, data) => {
    //     if (err) return res.status(500).json(err);
    //     return res.json("Post has been updated.");
    //   });
  });
};

const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  // console.log(token);
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    const q =
      "INSERT INTO posts(`userid`, `title`, `desc`, `img`, `date`, `cat`) VALUES (?, ?, ?, ?, ?, ?)";

    // const values = [
    //   userInfo.id,
    //   req.body.title,
    //   req.body.desc,
    //   req.body.img,
    //   req.body.date,
    //   req.body.cat,
    // ];
    // const check = values.map((value) => {
    //   if (value == undefined || value == null || value == {}) {
    //     return res
    //       .status(404)
    //       .json("some of the values are undefiend or null!");
    //   }
    // });
    console.log(req.body);
    //  const image = req.body.postDetails.file.name
    //  console.log(image)
    const { postDetails } = req.body;
    if (!postDetails.img) {
      return res.status(400).send("Image field is missing!");
    }
    const { title, desc, file, img, date, cat, status } = req.body.postDetails;
    //     console.log(status);
    // console.log(title)
    if (!title || !desc || !img || !date || !cat) {
      return res.status(400).json("Some of the required fields are missing!");
    }
    const values = [userInfo.id, title, desc, img, date, cat];

    if (status == "draft") {
      console.log("draft excuted");
      const values2 = [userInfo.id, title, desc, img, date, cat, status];

      const q2 =
        "INSERT INTO posts(`userid`, `title`, `desc`, `img`, `date`, `cat`,`status`) VALUES (?, ?, ?, ?, ?, ?,?)";
      const [data] = await promisePool.execute(q2, values2);
      console.log(data);
      return res.status(200).json("post uploaded draft");
    } else {
      console.log("published excuted");
      // console.log(userInfo.id + "kk");
      // console.log(check);
      const [data] = await promisePool.execute(q, values);
      if (data.affectedRows === 0) {
        // return res.status(404).json("Post not found.");
        return res.status(500).json("error uploading the post");
      }
      return res.status(200).json("post uploaded published");
    }
  });
};
module.exports = { getPosts, getPost, deletePost, updatePost, addPost };
