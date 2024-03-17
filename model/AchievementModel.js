const mongoose = require("mongoose");

// Set the predefined founding date
const predefinedFoundingDate = new Date("2020-01-01");

const achievementSchema = new mongoose.Schema(
  {
    finished_projects: {
      type: String,
      default: "0",
    },
    staff: {
      type: String,
      default: "0",
    },
    foundingDate: {
      type: Date,
      default: predefinedFoundingDate, // Set the default value to the predefined founding date
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

achievementSchema.virtual("companyExperienceYears").get(function () {
  const foundingDate = this.foundingDate;
  const currentDate = new Date();
  const experienceInMilliseconds = currentDate - foundingDate;
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Accounting for leap years
  return Math.floor(experienceInMilliseconds / millisecondsInYear);
});

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
