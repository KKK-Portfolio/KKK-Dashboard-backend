const express = require("express");
const {
  checkUploadConditions,
} = require("../middleware/checkUploadConditions");
const { uploadImage } = require("../controllers/contentImageController");
const imageContent = require("../config/contentLogic");

const router = express.Router();

router.post(
  "/upload",
  imageContent.array("images", 3),
  checkUploadConditions,
  uploadImage
);

module.exports = router;
