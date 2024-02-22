const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

//User Define Module
const { imageLimit } = require("../middleware/imageLimit");
const imageController = require("../config/imageController");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the uploaded file with a timestamp and its original name
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

// Routes
router.post(
  "/api/v1/upload",
  authMiddleware,
  imageLimit,
  upload.single("image"),
  imageController.createImage
);
router.get("/api/v1/allimages", authMiddleware, imageController.getAllImages);
router.get("/api/v1/:id", authMiddleware, imageController.getImageById);
router.put(
  "/api/v1/:id",
  authMiddleware,
  upload.single("image"),
  imageController.updateImageById
);
router.delete("/api/v1/:id", authMiddleware, imageController.deleteImageById);

module.exports = router;
