const mongoose = require("mongoose");

// Define the schema for uploaded images
const bannerSchema = new mongoose.Schema({
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
const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
