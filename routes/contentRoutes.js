const express = require("express");
const {
  checkUploadConditions,
} = require("../middleware/checkUploadConditions");
const contents = require("../controllers/contentImageController");
const imageContent = require("../config/contentLogic");

const router = express.Router();

router.post(
  "/api/v1/upload",
  imageContent.array("images", 3),
  checkUploadConditions,
  contents.uploadImage
);
router.get("/api/v1/allContents", contents.getAllContents);
router.get("/api/v1/:id", contents.getcontents);
router.put("/api/v1/text/:id", contents.updateText);
router.put(
  "/api/v1/:id/allImages",
  imageContent.array("images", 3),
  contents.updateAllImages
);
router.put(
  "/api/v1/:id/images/:imageId",
  imageContent.array("images", 3),
  contents.updateIndividualImage
);
router.delete("/api/v1/:id", contents.deleteContent);

module.exports = router;
