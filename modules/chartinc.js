const { connection } = require("../database");

// Count All Incidence in the database
exports.getCountIncidence = (req, res) => {
  connection.query(
    "SELECT COUNT(*) AS count FROM posts",
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching member count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count Category Incidence In Database
exports.getCountCategory = (req, res) => {
  const category = req.params.category;
  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE Category = ?",
    [category],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching member count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count location Incidence In Database
exports.getCountLocation = (req, res) => {
  const location = req.params.location;
  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE location = ?",
    [location],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching member count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count poststatus Incidence In Database
exports.getCountPostStatus = (req, res) => {
  const poststatus = req.params.poststatus;
  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE poststatus = ?",
    [poststatus],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching member count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count Category Incidence by Location In Database
exports.getCountCategorybyLocation = (req, res) => {
  const location = req.params.location;
  const category = req.params.category;
  connection.query(
    "SELECT category, COUNT(*) AS count FROM posts WHERE location = ? AND category = ? GROUP BY category",
    [location, category],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching category count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          res.json(results[0].count);
        } else {
          res.json("ไม่มีรายการ");
        }
      }
    }
  );
};

// Count ToDay Incidence In Database
exports.getCountToDay = (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;

  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE date(date) = ?",
    [formattedDate],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching incidence count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count Month Incidence In Database
exports.getCountMonthIncidence = (req, res) => {
  const month = req.params.month;
  const year = new Date().getFullYear();
  const formattedMonth = ("0" + month).slice(-2);
  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE YEAR(date) = ? AND MONTH(date) = ?",
    [year, formattedMonth],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching incidence count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count Category Of Month Incidence In Database
exports.getCountCategoryOfMonth = (req, res) => {
  const category = req.params.category;
  const month = req.params.month;
  const year = new Date().getFullYear();
  const formattedMonth = ("0" + month).slice(-2);

  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE category = ? AND YEAR(date) = ? AND MONTH(date) = ?",
    [category, year, formattedMonth],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching incidence count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count Category Of Today Incidence In Database
exports.getCountCategoryOfToday = (req, res) => {
  const category = req.params.category;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);

  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE category = ? AND DATE(date) = ?",
    [category, `${year}-${month}-${day}`],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching incidence count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};

// Count By MonthNow By Category Incidence In Database
exports.getCountByMonthNowAndCategory = (req, res) => {
  const category = req.params.category;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);

  connection.query(
    "SELECT COUNT(*) AS count FROM posts WHERE category = ? AND YEAR(date) = ? AND MONTH(date) = ?",
    [category, year, month],
    function (err, results, fields) {
      if (err) {
        console.error("Error while fetching incidence count:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results[0].count);
      }
    }
  );
};
