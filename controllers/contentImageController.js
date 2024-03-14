const ImageContent = require("../models/ImageContent");
const TextContent = require("../models/TextContent");
const fs = require("fs");
const path = require("path");

// uploadController.js

exports.uploadContent = async (req, res) => {
  try {
    // Extract text content fields from request body
    const { title, description, category, favorite } = req.body;

    // Check if text content fields are provided
    if (!title || !description) {
      return res
        .status(400)
        .send("Title and description are required for text content.");
    }

    // Handle casting for the favorite field
    let parsedFavorite;
    if (typeof favorite === "string" && favorite.trim() !== "") {
      parsedFavorite = favorite === "true"; // Convert the string value to a Boolean
    } else {
      parsedFavorite = favorite; // Use the provided value if it's already a valid Boolean or null
    }

    // Save text content to database
    const savedTextContent = await TextContent.create({
      title,
      description,
      category,
      favorite: parsedFavorite,
    });

    // Process uploaded files and extract relevant information
    const imagesData = req.files.map((file) => ({
      filename: file.filename,
      filepath: path.join("public/contents", file.filename),
    }));

    // Save image content to database
    const imageContentData = {
      textContentRef: savedTextContent._id,
      images: imagesData,
    };
    const savedImageContent = await ImageContent.create(imageContentData);

    res.status(200).json({
      status: 200,
      message: "success",
    });
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
  const { favorite, category, page, limit } = req.query;
  const query = {};

  if (favorite !== undefined) {
    query.favorite = favorite;
  }

  if (category !== undefined) {
    query.category = category;
  }

  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  try {
    let textContents, imageContents;

    if (favorite === "true") {
      // If favorite is set to true, first retrieve favorite documents
      textContents = await TextContent.find({ favorite: true, ...query })
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);

      imageContents = await ImageContent.find({ favorite: true, ...query })
        .populate("textContentRef")
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
    } else {
      // If favorite is not set to true, retrieve documents without considering favorite status
      textContents = await TextContent.find(query)
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);

      imageContents = await ImageContent.find(query)
        .populate("textContentRef")
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);
    }

    // Check if both textContents and imageContents are empty
    if (textContents.length === 0 && imageContents.length === 0) {
      // Send 404 Not Found response
      return res
        .status(404)
        .json({ status: 404, message: "No documents found" });
    }

    // Send the fetched contents
    res.status(200).json({ textContents, imageContents });
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET
//Get contents by id
exports.getcontents = async (req, res) => {
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

//PUT
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

//PUT
//Update image by id
exports.updateIndividualImage = async (req, res) => {
  const { id: imageId } = req.params;

  try {
    // Find the image content by ID
    const imageContent = await ImageContent.findOne({ "images._id": imageId });

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

    // Retrieve the uploaded file from the request
    const uploadedFile = req.file;

    // Check if a file was uploaded
    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract filename and filepath from the uploaded file
    const filename = uploadedFile.filename; // Use the filename generated by multer
    const filepath = uploadedFile.path; // Use the filepath generated by multer

    // Remove the old image file from the server if path exists
    if (imageContent.images[imageIndex].filepath) {
      const oldImagePath = path.resolve(
        __dirname,
        "..",
        imageContent.images[imageIndex].filepath
      );
      fs.unlinkSync(oldImagePath);
    }

    // Update the image data in the database
    imageContent.images[imageIndex].filename = filename; // Use the filename generated by multer
    imageContent.images[imageIndex].filepath = filepath; // Use the filepath generated by multer

    // Save the updated image content to the database
    await imageContent.save();

    res.status(200).json({
      message: "Image updated successfully",
      filename,
      filepath,
    });
  } catch (error) {
    console.error("Error updating individual image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//DELETE
// Delete image by id
exports.deleteIndividualImage = async (req, res) => {
  const { id: imageId } = req.params; // Assuming you have the imageId in your route params
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
