const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

const imageContentSchema = new mongoose.Schema({
  textContent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TextContent",
    required: true,
  },
  images: [imageSchema],
});

const ImageContent = mongoose.model("ImageContent", imageContentSchema);

module.exports = ImageContent;
