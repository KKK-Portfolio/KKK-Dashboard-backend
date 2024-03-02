const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  company_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  about_project: {
    type: String,
    require: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
