const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Logo = mongoose.model("Logo", logoSchema);

module.exports = Logo;
