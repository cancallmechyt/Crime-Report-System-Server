//ChMbr = Chart Members
const { connection } = require("../database");

// Get total count of members in the database
exports.getCountMember = (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM members";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching member count:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const totalCount = results[0].count;
    res.json(totalCount);
  });
};

// Get count of members based on role
exports.getCountRole = (req, res) => {
  const role = req.params.role;
  const query = "SELECT COUNT(*) AS count FROM members WHERE role = ?";

  connection.query(query, [role], (err, results) => {
    if (err) {
      console.error("Error fetching member count by role:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const countByRole = results[0].count;
    res.json(countByRole);
  });
};

// Get count of members belonging to a specific college
exports.getCountCollege = (req, res) => {
  const college = req.params.college;
  const query = "SELECT COUNT(*) AS count FROM members WHERE College = ?";

  connection.query(query, [college], (err, results) => {
    if (err) {
      console.error("Error fetching member count by college:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const countByCollege = results[0].count;
    res.json(countByCollege);
  });
};
