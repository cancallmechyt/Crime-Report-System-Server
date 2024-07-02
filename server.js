const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT;
const URL = process.env.HTTP;

// Importing routers
const lineRouters = require("./routes/line");
const membersRouters = require("./routes/members");
const postsRouters = require("./routes/posts");
const chartbarRouters = require("./routes/chartbar");

// Enable CORS and JSON parsing
app.use(cors({ origin: URL, credentials: true }));
app.use(express.json());

// Root route
app.get("/hello", (req, res) => {
  console.log("Server Online");
  res.send("Hello from Server!!");
});

// Routes
app.use("/line", lineRouters);
app.use("/members", membersRouters);
app.use("/posts", postsRouters);
app.use("/chartbar", chartbarRouters);

// Start server at Port
app.listen(port, function () {
  console.log("Server is Online");
});
