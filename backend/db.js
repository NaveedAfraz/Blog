const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config(); // Load environment variables

const { MYSQL_HOST, DATABASE_URL, DB_CONNECTION_LIMIT = 10 } = process.env;

let pool;

if (DATABASE_URL) {
  console.log("Using DATABASE_URL for MySQL connection.");

  pool = mysql.createPool({
    uri: DATABASE_URL, // Use the DATABASE_URL directly
    connectionLimit: parseInt(DB_CONNECTION_LIMIT, 10),
    ssl: {
      ca: fs.readFileSync("../ca (1).pem"), // Reference the CA file in the root directory
      rejectUnauthorized: true, // Enforce SSL for secure connections
    },
  });
} else {
  console.error("DATABASE_URL is not defined in the environment variables.");
  process.exit(1); // Exit the process if the DATABASE_URL is not set
}

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the MySQL database successfully.");
    connection.query("SELECT DATABASE();", (queryErr, results) => {
      if (queryErr) {
        console.error("Error executing query:", queryErr.message);
      } else {
        console.log("Connected to the database:", results[0]["DATABASE()"]);
      }
      connection.release(); // Release the connection back to the pool
    });
  }
});

// Export the promise-based pool
const promisePool = pool.promise();

module.exports = promisePool;
