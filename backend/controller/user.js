const multer = require("multer");

const promisePool = require("../db.js");

const updateuserdetails = async (req, res) => {
  try {
    const { username, email, image } = req.body;
    const { id } = req.params;
    console.log(image);
    // console.log("Username:", username);
    // console.log("Email:", email);
    // console.log("ID:", id);

    if (!username || !email || !id) {
      return res.status(400).json("no data");
    }

    const q =
      "UPDATE userauth SET username = ?, email = ? ,userimg = ? WHERE ID = ?";
    const [result] = await promisePool.execute(q, [username, email, image, id]);

    if (result.affectedRows >= 1) {
      const fetch = "SELECT * FROM userauth WHERE ID = ?";

      const [fetchResult] = await promisePool.execute(fetch, [id]);

      res.status(200).json({
        message: "User updated successfully and the data is send to client",
        user: fetchResult[0],
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json("Internal server error");
  }
};

const getuserPosts = async (req, res) => {
  // const { cat } = req.query;
  // console.log(cat);
  const { id } = req.params;
  //console.log(id);
  // if (!cat) {
  //   return res.status(400).json({ message: "Category not provided" });
  // }

  const query = "SELECT * FROM posts WHERE userid = ?";

  try {
    const [data] = await promisePool.execute(query, [id]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};
//  const updateDetails = async (req, res) => {
//   // const {newDetails} = req.body;
//   // console.log(newDetails)
//   const data = req.body;
//    console.log(data);
//   const id = req.params.id;
//   // const spilit = data.Dob.slice(0,10)
//   // console.log(spilit)
//   // if (!data.Dob || !id) {
//   //   return res.status(400).json({ error: "Missing required fields" });
//   // }

//   const formattedDob = data.Dob.slice(0, 10);

//   // console.log(id);
//   const { FirstName, LastName, Bio, PhoneNo } = data;
//   // console.log(FirstName);
//   const values = [FirstName, LastName, Bio, PhoneNo, id];
//   const query = `
//     UPDATE userinfo
//     SET FirstName = ?, LastName = ?, Bio=?, PhoneNo=?
//     WHERE userauthid = ?;
//   `;

//   // const query2 = `SELECT * FROM userinfo WHERE userauthid=? `;
//   try {
//     const [result] = await promisePool.execute(query, values);
//     console.log(result);
//     if (result.affectedRows === 0) {
//       return res.status(404).json("No user found to update.");
//     }
//     // res.status(200).json("Updated the values");
//   } catch (error) {
//     console.log(error);
//     res.status(401).json("eroor updaying the values");
//   }
// };

const updateDetails = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  console.log(data);
  // const formattedDob = data.Dob ? data.Dob.slice(0, 10) : null;
  const { FirstName, LastName, Dob, Bio, PhoneNo } = data;
  if (!FirstName || !LastName || !PhoneNo) {
    console.log(FirstName);
    console.log(LastName);
    console.log(PhoneNo);
    console.error("Missing required fields");
    return res.json("problem");
  }
  const updateQuery = `
    UPDATE userinfo
    SET FirstName = ?, LastName = ?,Dob =?, Bio = ?, PhoneNo = ?
    WHERE userauthid = ?;
  `;
  const selectQuery = `SELECT * FROM userinfo WHERE userauthid = ?`;

  try {
    const [updateResult] = await promisePool.execute(updateQuery, [
      FirstName,
      LastName,
      Dob,
      Bio,
      PhoneNo,
      id,
    ]);
    console.log(updateResult);
    if (updateResult.affectedRows === 0) {
      return res.status(404).json("No user found to update.");
    }

    // Fetch updated data and return it
    const [updatedUser] = await promisePool.execute(selectQuery, [id]);
    res.status(200).json({
      message: "User details updated successfully",
      updatedUser: updatedUser[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating the user details.");
  }
};

const details = async (req, res) => {
  const id = req.params.id;
  const query = `SELECT DATE(Dob) AS Dob, FirstName, LastName, Bio, PhoneNo FROM userinfo WHERE userauthid = ?`;

  try {
    const [rows] = await promisePool.execute(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res
      .status(200)
      .json({ message: "User details retrieved", updatedUser: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user details" });
  }
};
module.exports = { updateuserdetails, getuserPosts, updateDetails, details };
