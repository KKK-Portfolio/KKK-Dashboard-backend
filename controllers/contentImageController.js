const ImageContent = require("../models/ImageContent");
const TextContent = require("../models/TextContent");
const fs = require("fs");
const path = require("path");

// uploadController.js

exports.uploadImage = async (req, res) => {
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

//GET
//get allContents

exports.getAllContents = async (req, res) => {
  try {
    const textContents = await TextContent.find();
    const imageContents = await ImageContent.find().populate("textContentRef");
    res.status(200).json({ textContents, imageContents });
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET
//Get contents by id
exports.getcontents = getContentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the content by ID
    const textContent = await TextContent.findById(id);
    const imageContent = await ImageContent.findOne({
      textContentRef: id,
    }).populate("textContentRef");

    if (!textContent || !imageContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json({ textContent, imageContent });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update
//Text and description update

exports.updateText = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Find the text content by ID and update its fields
    const updatedTextContent = await TextContent.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTextContent) {
      return res.status(404).json({ error: "Text content not found" });
    }
    res.status(200).json({
      message: "Text content updated successfully",
      updatedTextContent,
    });
  } catch (error) {
    console.error("Error updating text content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update
//All images

exports.updateAllImages = async (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  try {
    // Find the image content by ID
    let imageContent = await ImageContent.findById(id);

    // Check if image content exists
    if (!imageContent) {
      return res.status(404).json({ error: "Image content not found" });
    }

    // Save the updated image content
    imageContent = await imageContent.save();

    // Delete old images from server
    if (imageContent.images) {
      imageContent.images.forEach((image) => {
        const imagePath = path.join(__dirname, "..", image.path);
        fs.unlinkSync(imagePath);
      });
    }

    // Update images in the content
    imageContent.images = images;

    res.status(200).json({
      message: "All images updated successfully",
      updatedImageContent: imageContent, // Return the updated image content
    });
  } catch (error) {
    console.error("Error updating all images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//UPDATE
//Update image by id

exports.updateIndividualImage = async (req, res) => {
  const { id, imageId } = req.params;
  const { newImage } = req.body;

  try {
    // Find the image content by ID
    const imageContent = await ImageContent.findById(id);
    console.log(imageContent);

    if (!imageContent) {
      return res.status(404).json({ error: "Image content not found" });
    }

    // Check if the images array exists
    if (!imageContent.images || !Array.isArray(imageContent.images)) {
      return res
        .status(500)
        .json({ error: "Image array not found or invalid" });
    }

    // Find the index of the image to update
    const imageIndex = imageContent.images.findIndex(
      (image) => image._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete old image from server
    const oldImagePath = path.join(
      __dirname,
      "..",
      imageContent.images[imageIndex].path
    );
    fs.unlinkSync(oldImagePath);

    // Save the updated image content
    const updatedImageContent = await imageContent.save();

    // Update the image in the content
    imageContent.images[imageIndex] = newImage;

    console.log(updatedImageContent);

    res
      .status(200)
      .json({ message: "Image updated successfully", updatedImageContent });
  } catch (error) {
    console.error("Error updating individual image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//DELETE
//Delete contents by id

exports.deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the text content by ID
    const textContent = await TextContent.findById(id);

    if (!textContent) {
      return res
        .status(404)
        .json({ status: "404", error: "Text content not found" });
    }

    // Find the associated image content
    const imageContent = await ImageContent.findOne({ textContentRef: id });

    if (!imageContent) {
      return res
        .status(404)
        .json({ status: "404", error: "Image content not found" });
    }

    // Delete the associated images from the server
    imageContent.images.forEach((image) => {
      fs.unlinkSync(
        path.join(__dirname, "..", "public", "contents", image.filename)
      );
    });

    // Delete the image content record
    await ImageContent.findByIdAndDelete(imageContent._id);

    // Delete the text content record
    await TextContent.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: "200", message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
