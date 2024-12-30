const bcrypt = require('bcryptjs');

const promisePool = require("../db.js");
const nodemailer = require("nodemailer");
//import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
const { put } = require("../routes/user.js");
// import Cookies from "js-cookie";
// require('dotenv').config();

const register = async (req, res) => {
  // res.json("done"); alert
  const { body } = req;
  //console.log(pool);

  const { fullName, email, password } = body;
  // console.log(body);
  // // res.json(body);
  const q = "INSERT INTO UserAuth (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)";
  const hashedPassword = await bcrypt.hash(password, 10); // Use await to ensure password is hashed

  try {
    const [result] = await promisePool.execute(q, [
      fullName,
      email,
      hashedPassword,
    ]);
    const q2 = "INSERT INTO userinfo (userauthid) VALUES (?)";

    //console.log(result.insertId);
    if (result) {
      const [id] = await promisePool.execute(q2, [result.insertId]);
      //console.log(id);
    }
  //  console.log("Data inserted successfully:", result);
    res
      .status(200)
      .json({ message: "User registered successfully", data: result });
  } catch (err) {
    console.error("Error inserting data", err);
    res
      .status(500)
      .json({ message: "Failed to register user", error: err.message });
  }
};

const login = async (req, res) => {
  //   const { body } = req;
  // try {
  //   console.log(pool);
  // } catch (error) {
  //   return res.status(500).json({ error: "internal error" });
  // }

  // console.log("HEL ", body);

  // const hashPassword = async (password) => {
  //   const saltRounds = 10;
  //   return await bcrypt.hash(password, saltRounds);
  // };

  // const q = "SELECT PASSWORD FROM userauth WHERE EMAIL = ?";
  const { email, password } = req.body;
  const q = "SELECT * FROM UserAuth WHERE EMAIL = ?";

  try {
    const [result] = await promisePool.execute(q, [email]); // Execute the query with email
  //  console.log(result);

    if (result.length === 0) {
     // console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const storedHashedPassword = result[0].PASSWORD;

    // Compare the provided password with the stored hashed password
    const correct = await bcrypt.compare(password, storedHashedPassword);
    if (!correct) {
     // console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const expiresIn = "20m";
    const { PASSWORD, ...other } = result[0];
    const token = jwt.sign({ id: result[0].ID }, "jwtkey", { expiresIn });

    // const token = jwt.sign({ email }, secretKey, );
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "None", // Required for cross-origin
      secure: true, // 'false' for local development over HTTP
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

   // console.log("Login successful, token generated stored in cookies.");
    const query2 = "UPDATE userauth SET  temp_token = ? WHERE EMAIL = ?";
    const [putResult] = await promisePool.execute(query2, [token, email]);
   // console.log(putResult);
   // console.log(token);
    return res.status(200).json(other);
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
  // console.log(res.getHeaders());
};

const logout = async (req, res) => {
  const { email, token } = req.body;
 // console.log(email);
  const query = "UPDATE userauth SET temp_token = NULL WHERE email = ?";
  const [deleteResult] = await promisePool.execute(query, [email]);
 // console.log(deleteResult);
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "None", // For development; change to "None" for production
      secure: true, // Secure must be false on HTTP
      path: "/", // Ensure this matches the original cookie path
    })
    .status(200)
    .json("User has been logged out!");
};
// rechecks it if token is there then login will happen automatically again
const authCheck = async (req, res) => {
  const token = req.cookies.access_token;
  //  console.log(token);
  if (!token) return res.status(404).json("token not found");
  //(token);

  try {
    const decoded = jwt.verify(token, "jwtkey");
   // console.log(decoded.id);
    const id = decoded.id;
    const q = "SELECT * FROM userauth WHERE ID = ?";
    const [details] = await promisePool.execute(q, [id]);
    //console.log(details);
    return res.status(200).json({ data: details, mmessage: "auth restart" });
    //  console.log("Decoded Token:", decoded);
  } catch (error) {
  //  console.log(error);
    return res.status(403).json("inviald token or expired");
  }
};

const forgotPassword = async (req, res) => {
  const value = req.body.email;
  // console.log(value);
  const q = "SELECT * from userauth where EMAIL = ?";
  try {
    const [data] = await promisePool.execute(q, [value]);
  // console.log(data);
    const email = data[0]?.EMAIL;
  //  console.log(email);
    if (data.length !== 0) {
      const secretKey = "jwtke";
      console.log(secretKey);
      const expiresIn = "5m";
      const token = jwt.sign({ email }, secretKey, { expiresIn });

      try {
        const query = "UPDATE userauth SET temp_token = ? WHERE EMAIL = ?";
        const [data] = await promisePool.execute(query, [token, email]);
    //    console.log(data);
      } catch (error) {
        console.log(error + "not token inserted");
      }
      // console.log(token)
      return res.status(200).json({ data, token });
    } else {
      return res.status(400).json("not found");
    }
  } catch (error) {
    console.log("erronr");
  }
};

const sendResetEmail = async (userEmail, resetLink) => {
  try {
    // Step 1: Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Replace with your SMTP provider
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "naveedafraz123@gmail.com", // Your email
        pass: "utxbpcrswnoojrzx", // Your email password or app-specific password
      },
    });

    // Step 2: Email options
    const mailOptions = {
      from: '"YourAppName Support" <naveedafraz123@gmail.com>', // Sender address
      to: userEmail, // Receiver's email address
      subject: "Reset Your Password", // Subject line
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>This link will expire in 15 minutes.</p>
      `, // HTML body
    };

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: %s", info.messageId);
    return true; // Return success
  } catch (error) {
    console.error("Error sending email: ", error);
    return false; // Return failure
  }
};

const ResetPassword = async (req, res) => {
  const { Token, dbEmail } = req.body;
  console.log(dbEmail);
  const q = "SELECT * FROM userauth WHERE EMAIL = (?)";
  try {
    const [data] = await promisePool.execute(q, [dbEmail]);
    // console.log(data);
    if (data.length === 0) {
      return res.status(404).json("User not found");
    }

    const fetchToken = data[0].temp_token;
    // console.log(fetchToken);
    // res.status(200).json("the data is " + fetchToken);

    jwt.verify(fetchToken, "jwtke", async (err, decoded) => {
      if (err) {
        return res.status(403).json("Invalid or expired token", err);
      }
      console.log(new Date(decoded.iat * 1000));
      console.log(new Date(decoded.exp * 1000));
      if (decoded.email === dbEmail) {
        console.log("vaild");
        if (decoded.email === dbEmail) {
          console.log("Valid token");

          // const resetLink = `http:///reset-password?token=${Token}`;
          const resetLink = `https://wild-rats-add.loca.lt/login`;
          const emailSent = await sendResetEmail(dbEmail, resetLink);

          if (emailSent) {
            console.log(dbEmail);
            const query2 =
              "UPDATE userauth SET temp_token = NULL WHERE EMAIL = ?";
            const [putResult] = await promisePool.execute(query2, [dbEmail]);
            console.log("runn");
            console.log(putResult);
            return res
              .status(200)
              .json("Token is valid. Reset email sent successfully.");
          } else {
            return res
              .status(500)
              .json("Token is valid, but failed to send reset email.");
          }
        }
        return res.status(200).json("Token is valid");
      } else {
        console.log(" not vaild");
        return res.status(403).json("Token does not match the provided email");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json("data not got ");
  }
  // res.status(200).json("resetpassword");
};

module.exports = {
  register,
  login,
  logout,
  authCheck,
  forgotPassword,
  ResetPassword,
};
