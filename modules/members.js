const { connection } = require("../database");
const bcrypt = require("bcrypt");

// Get ALL USER
exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM `members`", function (err, results, fields) {
    res.json(results);
  });
};

//Get Member From UID (User)
exports.getProfile = (req, res) => {
  const uid = req.user.uid;
  connection.query(
    "SELECT * FROM `members` WHERE `uid` = ?",
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
exports.getFromUID = (req, res) => {
  const uid = req.params.uid;
  connection.query(
    "SELECT * FROM `members` WHERE `uid` = ?",
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

// Add New Member
exports.addNewMember = (req, res) => {
  const { usercode, fname, lname, college, major, email, password, lineid } =
    req.body;

  if (
    !usercode ||
    !fname ||
    !lname ||
    !college ||
    !major ||
    !email ||
    !password ||
    !lineid
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@rsu\.ac\.th$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Email must be an @rsu.ac.th address" });
  }

  let role;
  if (/^P\d{7}$/.test(usercode)) {
    role = "police";
  } else if (/^\d{7}$/.test(usercode)) {
    role = "user";
  } else {
    return res.status(400).json({ message: "Invalid usercode" });
  }

  connection.query(
    "SELECT `email`, `usercode` FROM `members` WHERE `email` = ? OR `usercode` = ?",
    [email, usercode],
    async (err, results) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ message: "Failed to register user" });
      }

      if (results.length > 0) {
        const existingEmail = results.some((row) => row.email === email);
        const existingUsercode = results.some(
          (row) => row.usercode === usercode
        );
        if (existingEmail)
          return res
            .status(400)
            .json({ message: "Email is already registered" });
        if (existingUsercode)
          return res
            .status(400)
            .json({ message: "UserCode is already registered" });
        return;
      }

      try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        connection.query(
          "INSERT INTO `members`(`usercode`, `fname`, `lname`, `college`, `major`, `email`, `password`, `lineid`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            usercode,
            fname,
            lname,
            college,
            major,
            email,
            hashedPassword,
            lineid,
            role,
          ],
          (err, results) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res
                .status(500)
                .json({ message: "Failed to register user" });
            }
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  );
};

// Edit User
exports.updateUsers = async (req, res) => {
  const uid = req.params.uid;
  const { usercode, fname, lname, college, major, email, role, password } =
    req.body;

  let fields = [];
  let values = [];

  if (usercode) {
    fields.push("usercode = ?");
    values.push(usercode);
  }
  if (fname) {
    fields.push("fname = ?");
    values.push(fname);
  }
  if (lname) {
    fields.push("lname = ?");
    values.push(lname);
  }
  if (college) {
    fields.push("college = ?");
    values.push(college);
  }
  if (major) {
    fields.push("major = ?");
    values.push(major);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (role) {
    fields.push("role = ?");
    values.push(role);
  }
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the new password
    fields.push("password = ?");
    values.push(hashedPassword);
  } else {
    // If no new password provided, use the existing password from the database
    fields.push("password = password"); // Ensure not to update the password field
  }

  if (fields.length === 0) {
    return res.status(400).send("No fields to update");
  }

  values.push(uid);

  const query = `UPDATE \`members\` SET ${fields.join(", ")} WHERE \`uid\` = ?`;

  connection.query(query, values, function (err, results) {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Failed to update user");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  });
};

exports.updateUser = async (req, res) => {
  try {
    const uid = req.params.uid;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    connection.query(
      "UPDATE `members` SET `usercode`=?, `fname`=?, `lname`=?, `college`=?, `major`=?, `email`=?, `password`=?, `role`=? WHERE uid = ?",
      [
        req.body.usercode,
        req.body.fname,
        req.body.lname,
        req.body.college,
        req.body.major,
        req.body.email,
        hashedPassword,
        req.body.role,
        uid,
      ],
      function (err) {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).send("Failed to update user");
        } else {
          console.log("User updated successfully");
          res.status(200).send("User has been updated!!");
        }
      }
    );
  } catch (err) {
    console.error("Error hashing password or updating user:", err);
    res.status(500).send("Failed to update user");
  }
};

// Delete User From UID
exports.DeleteFromUID = (req, res) => {
  const uid = req.params.uid;
  connection.query(
    "DELETE FROM `members` WHERE `uid` = ?",
    [uid],
    function (err, results) {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Internal Server Error: Failed to delete user");
      } else if (results.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("User deleted successfully");
      }
    }
  );
};

// Get All LineID
exports.getAllUID = (req, res) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT `lineid` FROM `members`",
      function (err, results, fields) {
        if (err) {
          console.error("Error fetching user IDs:", err);
          reject("Failed to fetch user IDs");
          return;
        }
        const userId = results.map((row) => row.lineid);
        resolve(userId);
      }
    );
  });
};
