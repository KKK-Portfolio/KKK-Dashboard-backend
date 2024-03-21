const AboutUs = require("../models/aboutUsModel");

// exports.createAboutUs = async (req, res) => {
//   try {
//     const { history, mission, vision } = req.body;

//     if (!history || !mission || !vision) {
//       return res.status(400).json({
//         message: "Please provide all required fields.",
//       });
//     }

//     const aboutUs = new AboutUs({
//       history,
//       mission,
//       vision,
//     });

//     await aboutUs.save();
//     return res
//       .status(201)
//       .json({ status: 201, message: "About Us created successfully", aboutUs });
//   } catch (error) {
//     console.error("Error fetching testimonials:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
exports.getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.find();

    // Respond with fetched
    return res.status(200).json({ status: 200, aboutUs });
  } catch (error) {
    console.error("Error fetching About Us:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.updateAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const { history, mission, vision } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    let aboutUs = await AboutUs.findById(id);

    if (!aboutUs) {
      return res
        .status(404)
        .json({ status: 404, message: "Document not found" });
    }

    if (history || mission || vision) {
      if (history) aboutUs.history = history;
      if (mission) aboutUs.mission = mission;
      if (vision) aboutUs.vision = vision;
    }

    await aboutUs.save();

    return res.status(200).json({
      status: 200,
      message: "Updated successfully",
      aboutUs,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// exports.deleteAboutUs = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ error: "Invalid Aboout Us ID" });
//     }

//     const aboutUs = AboutUs.findById(id);
//     if (!aboutUs) {
//       return res
//         .status(404)
//         .json({ status: 404, messgae: "About Us not found" });
//     }

//     await AboutUs.findByIdAndDelete(id);

//     return res
//       .status(200)
//       .json({ status: 200, message: "About us deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting About Us by ID:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
