const mongoose = require("mongoose");

const textContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ["CategoryA", "CategoryB", "CategoryC"], // Predefined categories
    required: true,
  },
});

const TextContent = mongoose.model("TextContent", textContentSchema);

module.exports = TextContent;
