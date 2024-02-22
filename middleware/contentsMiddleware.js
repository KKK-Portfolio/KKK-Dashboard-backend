const multer = require("multer");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/contents");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer instance with the storage configuration
const contentsMiddleware = multer({ storage: storage });

module.exports = contentsMiddleware;
