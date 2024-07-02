const { connection } = require("../database");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const URL = process.env.BASE_URL;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

exports.getImg = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found");
    }
  });
};

// Get ALL Post
exports.getAllPost = (req, res) => {
  connection.query(
    `SELECT *, CONCAT("${URL}", image) AS imageUrl FROM posts`,
    // 'SELECT * FROM `posts`',
    function (err, results, fields) {
      res.json(results);
    }
  );
};

//Get Post From PID
exports.getPostFromPID = (req, res) => {
  const pid = req.params.pid;
  connection.query(
    `SELECT *, CONCAT("${URL}", image) AS imageUrl FROM posts WHERE pid = ? `,
    [pid],
    function (err, results) {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Failed to fetch user");
      } else {
        res.json(results);
      }
    }
  );
};

//Get Post From UID
exports.getMyPost = (req, res) => {
  const uid = req.user.uid;
  connection.query(
    "SELECT * FROM `posts` WHERE `uid` = ?",
    [uid],
    function (err, results) {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Failed to fetch user");
      } else {
        res.json(results);
      }
    }
  );
};

//Get Member From UID (Admin)
exports.getPostFromUID = (req, res) => {
  const uid = req.params.uid;
  connection.query(
    `SELECT *, CONCAT("${URL}", image) AS imageUrl FROM posts WHERE uid = ? `,
    [uid],
    function (err, results) {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Failed to fetch user");
      } else {
        res.json(results);
      }
    }
  );
};

//Get Post From Category
exports.getPostFromCategory = (req, res) => {
  const category = req.params.category;
  connection.query(
    `SELECT *, CONCAT("${URL}", image) AS imageUrl FROM posts WHERE category = ? `,
    [category],
    function (err, results) {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Failed to fetch user");
      } else {
        res.json(results);
      }
    }
  );
};

// Add New Post (User)
exports.addNewPost = (req, res) => {
  const uid = req.user.uid;
  const currentDate = new Date();
  const currentTime = currentDate
    .toLocaleTimeString("th-TH", { hour12: false })
    .slice(0, 5);

  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file." });
    }

    const fileName = req.file.filename;
    connection.query(
      "INSERT INTO `posts`(`title`, `detail`, `category`, `location`, `image`, `date`, `time`, `poststatus`, `note`, `uid`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.title,
        req.body.detail,
        req.body.category,
        req.body.location,
        fileName,
        currentDate,
        currentTime,
        req.body.poststatus,
        req.body.note,
        uid,
      ],
      function (err, results) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).send("Post has been created successfully!");
        }
      }
    );
  });
};

// Add New Post (Admin)
exports.addNewPostAdmin = (req, res) => {
  const uid = req.user.uid;

  const currentDate = new Date();
  const currentTime = currentDate
    .toLocaleTimeString("th-TH", { hour12: false })
    .slice(0, 5);

  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "An error uploading the file." });
    }

    const fileName = req.file.filename;

    connection.query(
      "INSERT INTO `posts`(`title`, `detail`, `category`, `location`, `image`, `date`, `time`, `poststatus`, `note`, `uid`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.title,
        req.body.detail,
        req.body.category,
        req.body.location,
        fileName,
        currentDate,
        currentTime,
        req.body.poststatus,
        req.body.note,
        uid,
      ],
      function (err, results) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          const pid = results.insertId;
          res.status(200).json(pid);
        }
      }
    );
  });
};

exports.updatePosts = (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file." });
    }

    // Check if there is a new file uploaded
    const newFileName = req.file ? req.file.filename : null;

    // Update post data only when a new file is uploaded
    if (newFileName) {
      connection.query(
        "UPDATE `posts` SET `title`=?, `detail`=?, `category`=?, `location`=?, `image`=?, `poststatus`=?, `note`=? WHERE pid = ?",
        [
          req.body.title,
          req.body.detail,
          req.body.category,
          req.body.location,
          newFileName,
          req.body.poststatus,
          req.body.note,
          req.body.pid,
        ], // Extract request parameters
        function (err, results) {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      // If no new file is uploaded, there's no need to update the image in the database
      connection.query(
        "UPDATE `posts` SET `title`=?, `detail`=?, `category`=?, `location`=?, `poststatus`=?, `note`=? WHERE pid = ?",
        [
          req.body.title,
          req.body.detail,
          req.body.category,
          req.body.location,
          req.body.poststatus,
          req.body.note,
          req.body.pid,
        ], // Extract request parameters
        function (err, results) {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
        }
      );
    }
  });
};

// Edit Post
exports.updatePost = (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file." });
    }

    // Check if there is a new file uploaded
    const newFileName = req.file ? req.file.filename : null;

    // Update post data only when a new file is uploaded
    if (newFileName) {
      connection.query(
        "UPDATE `posts` SET `title`=?, `detail`=?, `category`=?, `location`=?, `image`=?, `poststatus`=?, `note`=? WHERE pid = ?",
        [
          req.body.title,
          req.body.detail,
          req.body.category,
          req.body.location,
          newFileName,
          req.body.poststatus,
          req.body.note,
          req.body.pid,
        ], // Extract request parameters
        function (err, results) {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      // If no new file is uploaded, there's no need to update the image in the database
      connection.query(
        "UPDATE `posts` SET `title`=?, `detail`=?, `category`=?, `location`=?, `poststatus`=?, `note`=? WHERE pid = ?",
        [
          req.body.title,
          req.body.detail,
          req.body.category,
          req.body.location,
          req.body.poststatus,
          req.body.note,
          req.body.pid,
        ], // Extract request parameters
        function (err, results) {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
        }
      );
    }
  });
};

// Deleted Post
exports.DeletePost = (req, res) => {
  const pid = req.params.pid;
  connection.query(
    "DELETE FROM `posts` WHERE `pid` = ?",
    [pid],
    function (err, results) {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Internal Server Error: Failed to delete post");
      } else if (results.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("Post has deleted successfully");
      }
    }
  );
};

exports.getNewOrder = (req, res) => {
  // Query to select all data from the 'incidence' table and concatenate image URL
  connection.query(
    `SELECT *, CONCAT("${URL}", \`image\`) AS imageUrl FROM posts ORDER BY pid DESC`,
    function (err, results, fields) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(results); // Send JSON response results
      }
    }
  );
};

exports.getNewOrderUID = (req, res) => {
  const uid = req.params.uid;
  connection.query(
    `SELECT *, CONCAT("${URL}", \`image\`) AS imageUrl FROM posts WHERE uid = ? ORDER BY pid DESC`,
    [uid],
    function (err, results) {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "An error occurred while fetching posts" });
      } else {
        res.json(results);
      }
    }
  );
};
