//Core Module
const ContactUs = require("../model/contactUsModel");

exports.formSubmit = async (req, res) => {
  try {
    const { company_name, email, about_project } = req.body;

    // Check if required fields are provided
    if (!company_name || !email || !about_project) {
      return res
        .status(400)
        .json({ status: 400, message: "All fields are required." });
    }

    // Check if the submission already exists in the database based on email and about_project
    const existingSubmission = await ContactUs.findOne({
      email,
      about_project,
      company_name,
    });
    if (existingSubmission) {
      return res
        .status(400)
        .json({ status: 400, message: "This submission already recieved" });
    }

    // Save text content to database
    const savedSubmitForm = await ContactUs.create({
      company_name,
      email,
      about_project,
    });

    // Respond with success message
    return res
      .status(200)
      .json({ status: 200, message: "Form submitted successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error in formSubmit:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error." });
  }
};

exports.submittedForm = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Submission ID is required." });
    }
    const submissions = await ContactUs.findById(id);

    // Check if submission exists
    if (!submissions) {
      return res
        .status(404)
        .json({ status: 404, message: "Submission not found." });
    }

    // Respond with submission data
    return res.status(200).json({ status: 200, submissions });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error." });
  }
};

exports.getAllForm = async (req, res) => {
  try {
    // Retrieve all submissions
    const submissions = await ContactUs.find();

    // Respond with submissions data
    return res.status(200).json({ status: 200, submissions });
  } catch (error) {
    // Handle errors
    console.error("Error in getAll:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

exports.deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubmission = await ContactUs.findByIdAndDelete(id);
    if (!deletedSubmission) {
      return res
        .status(404)
        .json({ status: 404, message: "Submission not found." });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Submission deleted successfully." });
  } catch (error) {
    console.error("Error in deleteById:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error." });
  }
};
