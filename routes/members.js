const express = require('express');
const router = express.Router();

const { login } = require("../modules/auth.js");
const { authenticateToken } = require('../modules/auth');
const { getAllUsers, getProfile, getFromUID, addNewMember, updateUser, DeleteFromUID, updateUsers } = require("../modules/members.js");

router.post("/login", login);
router.post("/register", addNewMember);

router.get("/all", authenticateToken, getAllUsers); 
router.get("/me", authenticateToken, getProfile); 
router.get("/:uid", authenticateToken, getFromUID); 

router.put("/edit/:uid", authenticateToken, updateUsers); 

router.delete("/delete/:uid", authenticateToken, DeleteFromUID)

module.exports = router;