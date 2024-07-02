const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../modules/auth');
const { 
    getAllPost, getPostFromPID, getMyPost, getPostFromCategory ,
    getPostFromUID, addNewPost, addNewPostAdmin, updatePost, updatePosts, 
    DeletePost, getImg, getNewOrder, getNewOrderUID
    } = require("../modules/posts.js");

router.get("/pic/:filename", getImg) 
router.get("/neworder", authenticateToken, getNewOrder)
router.get("/neworder/:uid", authenticateToken, getNewOrderUID)

router.get("/all", authenticateToken, getAllPost);
router.get("/my", authenticateToken, getMyPost);  
router.get("/:pid", authenticateToken, getPostFromPID);
router.get("/user/:uid", authenticateToken, getPostFromUID);
router.get("/category/:category", authenticateToken, getPostFromCategory);  

router.post("/addnew", authenticateToken, addNewPost)
router.post("/addnews", authenticateToken, addNewPostAdmin)

router.put("/edit/:pid", authenticateToken, updatePost)
router.put("/admin/edit/:pid", authenticateToken, updatePosts)

router.delete("/:pid", authenticateToken, DeletePost)

module.exports = router;