const mongoose = require("mongoose");
// const TextContent = (require = require("./TextContent"));

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

const imageContentSchema = new mongoose.Schema({
  textContentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TextContent",
    required: true,
  },
  images: [imageSchema],
});

const ImageContent = mongoose.model("ImageContent", imageContentSchema);

module.exports = ImageContent;
