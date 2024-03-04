const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  finished_projects: {
    type: String,
    required: true,
  },
  staff: {
    type: String,
    required: true,
  },
  experience: {
    type: Date,
    default: Date.now(),
  },
});

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
