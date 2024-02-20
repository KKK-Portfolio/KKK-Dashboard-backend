// imageMiddleware.js
const fs = require("fs");
const Image = require("../model/imageModel");

// Middleware to limit the maximum number of images
const imageLimit = async (req, res, next) => {
  try {
    // Get the current number of images in the database
    const imageCount = await Image.countDocuments();
    // Set the maximum limit for images (e.g., 10)
    const maxLimit = 5;

    // Check if the current number of images exceeds the maximum limit
    if (imageCount >= maxLimit) {
      return res.status(400).json({ message: "Maximum image limit reached" });
    }

    // If the limit is not reached, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error checking image limit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { imageLimit };
