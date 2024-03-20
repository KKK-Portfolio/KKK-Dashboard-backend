const Testimonial = require("../models/testimonialModel");
const fs = require("fs");
const path = require("path");

exports.createTestimonial = async (req, res) => {
  try {
    const { name, company, body } = req.body;

    // Validate input fields
    if (!name || !company || !body || !req.file) {
      return res.status(400).json({
        error: "Please provide all required fields including profile image",
      });
    }

    // Construct new testimonial instance
    const testimonial = new Testimonial({
      name,
      company,
      body,
      profile: {
        filename: req.file.filename,
        filepath: req.file.path,
      },
    });

    // Save testimonial to the database
    await testimonial.save();

    // Respond with success message
    return res
      .status(201)
      .json({ message: "Testimonial created successfully", testimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    // Fetch all testimonials from the database
    const testimonials = await Testimonial.find();

    // Respond with fetched testimonials
    return res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid testimonial ID" });
    }

    // Find testimonial by ID in the database
    const testimonial = await Testimonial.findById(id);

    // If testimonial with the given ID does not exist, return 404 Not Found
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Respond with the fetched testimonial
    return res.status(200).json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update testimonial content
exports.updateTestimonialContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, body } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid testimonial ID" });
    }

    // Find testimonial by ID in the database
    let testimonial = await Testimonial.findById(id);

    // If testimonial with the given ID does not exist, return 404 Not Found
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Update testimonial data if provided
    if (name || company || body) {
      if (name) testimonial.name = name;
      if (company) testimonial.company = company;
      if (body) testimonial.body = body;
    }

    // Update profile image if uploaded
    if (req.file) {
      // Delete existing profile image from the file system if it exists
      if (testimonial.profile.filepath) {
        await fs.unlink(testimonial.profile.filepath, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          }
        });
      }

      // Update profile image data
      testimonial.profile.filename = req.file.filename;
      testimonial.profile.filepath = req.file.path;
    }

    // Save updated testimonial to the database
    await testimonial.save();

    // Respond with success message and updated testimonial
    return res
      .status(200)
      .json({
        message: "Testimonial content updated successfully",
        testimonial,
      });
  } catch (error) {
    console.error("Error updating testimonial content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid testimonial ID" });
    }

    // Find testimonial by ID in the database
    const testimonial = await Testimonial.findById(id);

    // If testimonial with the given ID does not exist, return 404 Not Found
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Log the filepath to debug
    console.log("Deleting profile image at:", testimonial.profile.filepath);

    // Delete profile image from the file system
    await fs.promises.unlink(testimonial.profile.filepath);

    // Delete testimonial from the database
    await Testimonial.findByIdAndDelete(id);

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
