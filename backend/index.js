const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
const post = require("./routes/post");
const multer = require("multer");
const users = require("./routes/user");
const app = express();
const path = require("path");

app.use(
  "/uploaduserimg",
  express.static(path.join(__dirname, "../frontend/uploaduserimg"))
);
console.log('__dirname:', __dirname);
console.log(path.join(__dirname, "../frontend/uploaduserimg"));
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace with your frontend URL
//     credentials: true, // Allow credentials (cookies
//   })
// );
const frontendURL = "https://blog-oxt4fflaj-naveed-afrazs-projects.vercel.app/"; // Replace with your actual frontend URL
app.use(cors({ origin: frontendURL }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configuration for the first storage folder
const storageOne = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/upload"); // Folder for first type of files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Custom naming
  },
});
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
// Configuration for the second storage folder
const storageTwo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/uploaduserimg"); // Folder for second type of files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Custom naming
  },
});

// Multer instances for different folders
const uploadOne = multer({ storage: storageOne });
const uploadTwo = multer({ storage: storageTwo });

// Route for the first type of file upload
app.post("/upload", uploadOne.single("file"), function (req, res) {
  const file = req.file;
  // console.log(file);
  res.status(200).json(file.filename);
});

// Route for the second type of file upload
app.post("/uploaduserimg", uploadTwo.single("file"), function (req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    // console.log(file);
    res.status(200).json(file.filename);
  } catch (error) {
    // console.log(error)
    res.json("errorrrrr");
  }
});

app.use("/auth", auth);
app.use("/cat", post);
app.use("/user", users);
// app.get("/", (req, res) => {
//   res.json("done");
//   // const { body } = req;
//   // res.json(body)
// });
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
