const Logo = require("../models/LogoModel");
const fs = require("fs");

exports.createLogo = async (req, res) => {
  try {
    const { filename, path: filepath } = req.file;
    const newLogo = new Logo({ filename, filepath });
    const savedLogo = await newLogo.save();
    console.log(`newLogo : ${newLogo}`);
    console.log(`savedLogo : ${savedLogo}`);
    res.status(201).json(savedLogo);
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({ message: "Error creating image", error: error });
  }
};

// Get all images
exports.getAllLogo = async (req, res) => {
  try {
    const logos = await Logo.find();
    res.status(200).json(logos);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Error fetching images", error: error });
  }
};
// Get an image by ID
exports.getLogoById = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(logo);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image", error: error });
  }
};

exports.updateLogo = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the existing image by ID
    const existingImage = await Logo.findById(req.params.id);
    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Save the new image file to the file system
    const { filename, path: filepath } = req.file;

    // Update the image document with new filename and filepath
    const updatedImage = await Logo.findByIdAndUpdate(
      req.params.id,
      { filename, filepath },
      { new: true }
    );

    // Delete the old image file from the file system
    fs.unlinkSync(existingImage.filepath);

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Error updating image", error: error });
  }
};

exports.deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);
    if (!logo) {
      return res.status(404).json({ message: "Image not found" });
    }
    // Delete the image file from the server
    fs.unlinkSync(logo.filepath);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {}
};
