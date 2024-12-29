const express = require("express");
// const register = require("../controller/auth");
// const login = require("../controller/auth")
const {
  register,
  login,
  logout,
  authCheck,
  forgotPassword,
  ResetPassword,
} = require("../controller/auth");
const mysql = require("mysql2");
const router = express.Router();
console.log(register);
router.post("/login", login);
router.get("/authCheck", authCheck);
router.post("/logout", logout);
router.post("/signup", register);
router.post("/forgotPassword", forgotPassword);
router.post("/ResetPassword", ResetPassword)
module.exports = router;
