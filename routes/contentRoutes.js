const express = require("express");
const router = express.Router();
const contentsController = require("../config/contentsController");

router.get("/api/v1/createcontents", contentsController.createPost);
router.get("/api/v1/allcontents", contentsController.getAllPosts);
router.get("/api/v1/:id", contentsController.getPostById);
router.put("api/v1/:id", contentsController.updatePost);
router.delete("api/v1/:id", contentsController.deletePost);

module.exports = router;
