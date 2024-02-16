const mongoose = require("mongoose");

// Define the schema for image upload
const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  // Add any additional fields as needed
});

// Create a model based on the schema
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
