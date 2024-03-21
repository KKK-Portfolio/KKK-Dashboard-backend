const express = require("express");
const router = express.Router();
const multer = require("multer");

//User Define Module
const { imageLimit } = require("../middleware/imageLimit");
const bannerController = require("../controllers/bannerController");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/banner"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the uploaded file with a timestamp and its original name
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

// Routes
router.post(
  "/upload",
  imageLimit,
  upload.single("image"),
  bannerController.createImage
);
router.get("/images", bannerController.getAllImages);
router.get("/:id", bannerController.getImageById);
router.put("/:id", upload.single("image"), bannerController.updateImageById);
router.delete("/:id", bannerController.deleteImageById);

module.exports = router;
