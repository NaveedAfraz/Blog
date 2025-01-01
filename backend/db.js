const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables from .env file

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE, // Targeting the 'blogs' database
  MYSQL_PORT = "3306", // Default MySQL port if not provided
  DB_CONNECTION_LIMIT = "100",
} = process.env;

// Debugging logs for configuration
console.log("Using individual MySQL environment variables for connection.");
console.log("MYSQL_HOST:", MYSQL_HOST);
console.log("MYSQL_USER:", MYSQL_USER);
console.log("MYSQL_PASSWORD:", MYSQL_PASSWORD ? "******" : "Not provided");
console.log("MYSQL_DATABASE:", MYSQL_DATABASE);
console.log("MYSQL_PORT:", MYSQL_PORT);

let pool;

// Create a connection pool using the provided environment variables
pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: parseInt(DB_CONNECTION_LIMIT, 10),
  ssl: {
    rejectUnauthorized: true, // Enforce SSL for secure connections
  },
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the MySQL database successfully.");

    // Query to check the connected database
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
