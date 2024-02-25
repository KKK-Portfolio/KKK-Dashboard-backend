const ImageContent = require("../models/ImageContent");
const TextContent = require("../models/TextContent");
const path = require("path");

// uploadController.js

const uploadImage = async (req, res) => {
  try {
    // Extract text content fields from request body
    const { title, description } = req.body;

    // Check if text content fields are provided
    if (!title || !description) {
      return res
        .status(400)
        .send("Title and description are required for text content.");
    }

    // Save text content to database
    const savedTextContent = await TextContent.create({ title, description });

    // Process uploaded files and extract relevant information
    const imagesData = req.files.map((file) => ({
      filename: file.filename,
      path: path.join("public/contents", file.filename),
    }));

    // Save image content to database
    const imageContentData = {
      textContentRef: savedTextContent._id,
      images: imagesData,
    };
    const savedImageContent = await ImageContent.create(imageContentData);

    res.status(200).send("Images uploaded successfully.");
  } catch (error) {
    console.error("Error uploading images:", error);

    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation error", details: validationErrors });
    } else {
      // Other types of errors
      return res.status(500).send("An error occurred while uploading images.");
    }
  }
};

module.exports = { uploadImage };
