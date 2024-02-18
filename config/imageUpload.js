const multer = require("multer");
const path = require("path");
const Image = require("../model/imageModel");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = `public/img`; // Destination directory
    console.log("Destination path:", dest); // Log destination path
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Rename the uploaded file with a timestamp and its original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

// Function to handle image upload
async function imageUpload(req, res, next) {
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      return res.status(500).json({ message: "Multer error", error: err });
    } else if (err) {
      // An unknown error occurred during upload
      return res.status(500).json({ message: "Unknown error", error: err });
    }
    try {
      // Create a new Image document with the uploaded file information
      const newImage = new Image({
        filename: req.file.filename,
        path: req.file.path,
      });
      // Save the new Image document to the database
      const savedImage = await newImage.save();
      // File has been uploaded and saved to the database successfully
      res.status(200).json({
        message: "File uploaded and saved successfully",
        image: savedImage,
      });
    } catch (error) {
      // Error occurred while saving the Image document to the database
      console.error("Error saving image:", error);
      res
        .status(500)
        .json({ message: "Error saving image to database", error: error });
    }
  });
}

module.exports = imageUpload;
