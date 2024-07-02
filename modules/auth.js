const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connection } = require("../database");
require("dotenv").config();

const secret = process.env.SECRET;

function generateToken(user) {
  const payload = { uid: user.uid };
  return jwt.sign(payload, secret);
}

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    // if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  connection.query(
    "SELECT `uid`, `password`, `role` FROM `members` WHERE `email` = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Failed to login user" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const { uid, password: hashedPassword } = results[0];

      try {
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
          const token = generateToken({ uid });
          res.status(200).json({ token, uid });
        } else {
          res.status(401).json({ message: "Invalid email or password" });
        }
      } catch (error) {
        console.error("Error comparing password:", error);
        res.status(500).json({ message: "Failed to login user" });
      }
    }
  );
}

module.exports = { authenticateToken, login };
