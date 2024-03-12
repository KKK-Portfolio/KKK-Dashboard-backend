// contentLogic.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/contents");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageContent = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max file size
});

module.exports = imageContent;
