// imageRoutes.js
const express = require("express");
const imageUpload = require("../config/imageUpload"); // Adjust the path if necessary
const Image = require("../model/imageModel");

const router = express.Router();

// Route for uploading an image
router.post("/api/v1/upload", imageUpload);
router.get("/api/v1/upload", (req, res) => {
  res.send("This is upload");
});

// Route for getting all images
router.get("/api/v1/allimages", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Error fetching images", error: error });
  }
});

// Route for getting a single image by ID
router.get("/api/v1/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image", error: error });
  }
});

// Route for updating an image by ID
router.put("/api/v1/:id", async (req, res) => {
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Error updating image", error: error });
  }
});

// Route for deleting an image by ID
router.delete("/api/v1/:id", async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error: error });
  }
});

module.exports = router;
