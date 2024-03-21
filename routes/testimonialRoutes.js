const express = require("express");
const multer = require("multer");
const path = require("path");

const testimonialHandler = require("../controllers/testimonialControllers");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/testimonial"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the uploaded file with a timestamp and its original name
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

router.post(
  "/create",
  upload.single("profile"),
  testimonialHandler.createTestimonial
);
router.get("/", testimonialHandler.getTestimonials);
router.get("/:id", testimonialHandler.getTestimonialById);
router.put(
  "/:id",
  upload.single("profile"),
  testimonialHandler.updateTestimonialContent
);
router.delete("/:id", testimonialHandler.deleteTestimonialById);
module.exports = router;
