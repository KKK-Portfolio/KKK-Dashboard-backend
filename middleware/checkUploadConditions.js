const checkUploadConditions = (req, res, next) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // Check if too many files are uploaded
    if (req.files.length > 3) {
      return res.status(400).send("Maximum number of images exceeded.");
    }

    next(); // Proceed to the next middleware or controller function
  } catch (error) {
    console.error("Error checking upload conditions:", error);
    return res
      .status(500)
      .send("An error occurred while checking upload conditions.");
  }
};

module.exports = { checkUploadConditions };
