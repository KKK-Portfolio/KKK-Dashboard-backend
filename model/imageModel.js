const mongoose = require("mongoose");

// Define the schema for uploaded images
const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
