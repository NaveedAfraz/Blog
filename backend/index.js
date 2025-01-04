require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const auth = require("./routes/auth");
const post = require("./routes/post");
const users = require("./routes/user");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 const PORT = process.env.PORT || 3006;
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all route for React Router


// const allowedOrigins = [
//   "http://localhost:5173", // Local frontend URL
// ];
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://blog-theta-three-48.vercel.app", // Vercel deployment
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable cookies and authentication headers
  })
);


const backendUrl = "https://blog-3-mfgj.onrender.com";
// Middleware
app.use("/upload", express.static(path.join(__dirname, "../frontend/upload")));
app.use(
  "/uploaduserimg",
  express.static(path.join(__dirname, "../frontend/uploaduserimg"))
);

// Multer Configurations
const storageOne = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const storageTwo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/uploaduserimg"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPEG/PNG files allowed"));
};
const uploadOne = multer({ storage: storageOne, fileFilter });
const uploadTwo = multer({ storage: storageTwo, fileFilter });
console.log("Upload path:", path.join(__dirname, "../frontend/upload"));
console.log(
  "UploadUserImg path:",
  path.join(__dirname, "../frontend/uploaduserimg")
);

// Routes
app.post("/upload", uploadOne.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});
app.post("/uploaduserimg", uploadTwo.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  res.status(200).json(file.filename);
});
app.use("/auth", auth);
app.use("/cat", post);
app.use("/user", users);
app.get("/", (req, res) => res.json({ message: "Hello from the backend!" }));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});
// const PORT = 5000;
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on ${backendUrl}`);
});
