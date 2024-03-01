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
      filepath: path.join("public/contents", file.filename), // Change 'path' to 'filepath'
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
    res.status(200).json({ imageContents });
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
        const imagePath = path.join(__dirname, "..", image.filepath); // Change 'path' to 'filepath'
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

  try {
    // Find the image content by ID
    const imageContent = await ImageContent.findById(id);

    // Check if the image content exists
    if (!imageContent) {
      return res.status(404).json({ error: "Image content not found" });
    }

    // Find the index of the image to update
    const imageIndex = imageContent.images.findIndex(
      (image) => image._id.toString() === imageId
    );

    // Check if the image exists in the array
    if (imageIndex === -1) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract filename and path from the request body
    const { filename, filepath } = imageContent.images[imageIndex]; // Change 'path' to 'filepath'

    // Check if filename and filepath are provided
    if (!filename || !filepath) {
      // Change 'path' to 'filepath'
      return res
        .status(400)
        .json({ error: "Filename and filepath are required" }); // Change 'path' to 'filepath'
    }

    // Remove the old image file from the server if path exists
    if (imageContent.images[imageIndex].filepath) {
      // Change 'path' to 'filepath'
      const oldImagePath = path.resolve(
        __dirname,
        "..",
        imageContent.images[imageIndex].filepath // Change 'path' to 'filepath'
      );
      fs.unlinkSync(oldImagePath);
    }

    // Update the image data
    imageContent.images[imageIndex].filename = filename;
    imageContent.images[imageIndex].filepath = filepath; // Change 'path' to 'filepath'

    // Save the updated image content
    const updatedImageContent = await imageContent.save();

    res.status(200).json({
      message: "Image updated successfully",
      updatedImageContent,
    });
  } catch (error) {
    console.error("Error updating individual image:", error);
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation error", details: validationErrors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete image by id
exports.deleteIndividualImage = async (req, res) => {
  const { imageId } = req.params; // Assuming you have the imageId in your route params
  console.log(JSON.stringify(`req.params: ${req.params}`));
  console.log(`imageId : ${imageId}`);

  try {
    // Find the ImageContent document containing the image
    const imageContent = await ImageContent.findOne({ "images._id": imageId });
    console.log(`imageContent : ${imageContent}`);

    if (!imageContent) {
      return res.status(404).json({ message: "Image content not found" });
    }

    // Find the index of the image within the images array
    const imageIndex = imageContent.images.findIndex(
      (image) => image._id.toString() === imageId
    );
    console.log(`imageIndex : ${imageIndex}`);

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Get the filepath of the image to delete
    const imagePath = path.join(
      __dirname,
      "..",
      imageContent.images[imageIndex].filepath
    );

    // Delete the image file from the server
    fs.unlinkSync(imagePath);

    // Remove the image from the images array
    imageContent.images.splice(imageIndex, 1);

    // Save the updated ImageContent document
    await imageContent.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error: error });
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
