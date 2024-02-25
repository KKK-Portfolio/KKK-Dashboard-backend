const express = require("express");
const {
  checkUploadConditions,
} = require("../middleware/checkUploadConditions");
const { uploadImage } = require("../controllers/contentImageController");
const imageContent = require("../config/contentLogic");

const router = express.Router();

router.post(
  "/upload",
  checkUploadConditions,
  imageContent.array("images", 3),
  uploadImage
);

module.exports = router;
