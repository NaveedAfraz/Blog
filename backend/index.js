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
const PORT = process.env.PORT || 3006;

// CORS Configuration
const allowedOrigins = ["https://your-frontend-domain.com", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/uploaduserimg", express.static(path.join(__dirname, "../frontend/uploaduserimg")));

// Multer Configurations
const storageOne = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "upload")),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});
const storageTwo = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploaduserimg")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only JPEG/PNG files allowed"));
};
const uploadOne = multer({ storage: storageOne, fileFilter });
const uploadTwo = multer({ storage: storageTwo, fileFilter });

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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
