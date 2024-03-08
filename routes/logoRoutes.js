const express = require("express");
const multer = require("multer");
const logoController = require("../controllers/logoController");

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/logo"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the uploaded file with a timestamp and its original name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 5MB max file size
});

router.post("/api/v1/upload", upload.single("logo"), logoController.createLogo);
router.get("/api/v1/getAll", logoController.getAllLogo);
router.get("/api/v1/:id", logoController.getLogoById);
router.put("/api/v1/:id", upload.single("logo"), logoController.updateLogo);
router.delete("/api/v1/:id", logoController.deleteLogo);

module.exports = router;
