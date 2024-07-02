const mysql = require("mysql2");
require("dotenv").config();

// MySQL User & Password & Database name
module.exports = {
  connection: mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  }),
};
