// Core Module
const Image = require("../model/imageModel");
const fs = require("fs");

// Create a new image
exports.createImage = async (req, res) => {
  try {
    const { filename, path: filepath } = req.file;
    const newImage = new Image({ filename, filepath });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({ message: "Error creating image", error: error });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Error fetching images", error: error });
  }
};

// Get an image by ID
exports.getImageById = async (req, res) => {
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
};

// Update an image by ID
exports.updateImageById = async (req, res) => {
  try {
    // Find the existing image by ID
    const existingImage = await Image.findById(req.params.id);
    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the old image file from the file system
    fs.unlinkSync(existingImage.filepath);

    // Save the new image file to the file system
    const { filename, path: filepath } = req.file;
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { filename, filepath },
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
};

// Delete an image by ID
exports.deleteImageById = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    // Delete the image file from the server
    fs.unlinkSync(image.filepath);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error: error });
  }
};
