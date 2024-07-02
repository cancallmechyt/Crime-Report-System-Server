const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../modules/auth');
const { getCountMember, getCountRole, getCountCollege } = require("../modules/chartmbr");
const { 
    getCountIncidence, getCountCategory, getCountLocation, getCountPostStatus, 
    getCountCategorybyLocation, getCountToDay, getCountMonthIncidence,
    getCountCategoryOfMonth,getCountCategoryOfToday, getCountByMonthNowAndCategory
  } = require("../modules/chartinc");

router.get("/member/all", authenticateToken, getCountMember); 
router.get("/member/role/:role", authenticateToken, getCountRole); 
router.get("/member/coll/:college", authenticateToken, getCountCollege); 

router.get("/incidence/all", authenticateToken,getCountIncidence); // Get Count of Incidences
router.get("/incidence/cate/:category", authenticateToken,getCountCategory); // Get Count of Incidences by Category
router.get("/incidence/location/:location", authenticateToken,getCountLocation); // Get Count of Incidences by Location
router.get("/incidence/status/:poststatus", authenticateToken,getCountPostStatus); // Get Count of Incidences by Post Status
router.get("/incidence/catebylocation/:location/:category", authenticateToken,getCountCategorybyLocation); // Get Count of Incidences by Category and Location

router.get("/incidence/today", authenticateToken,getCountToDay); // Get Count of Incidences for Today
router.get("/incidence/today/:category", authenticateToken,getCountCategoryOfToday); // Get Count of Incidences by Category for Today
router.get("/incidence/month/:month", authenticateToken,getCountMonthIncidence); // Get Count of Incidences for a Specific Month
router.get("/incidence/monthnow/:category", authenticateToken,getCountByMonthNowAndCategory); // Get Count of Incidences by Category for the Current Month
router.get("/incidence/cateofmonth/:category/:month", authenticateToken,getCountCategoryOfMonth); // Get Count of Incidences by Category for a Specific Month

module.exports = router;