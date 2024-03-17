const Achievement = require("../models/AchievementModel");

exports.getFinishedProjects = async (req, res) => {
  try {
    // Fetch all Achievement documents
    const achievements = await Achievement.find({}, "finished_projects");

    // If there are no achievements or if all achievements have no value for finished_projects,
    // return the default value
    let finishedProjects;
    if (
      achievements.length === 0 ||
      achievements.every((achievement) => !achievement.finished_projects)
    ) {
      finishedProjects = ["0"];
    } else {
      // Extract finished projects from the documents
      finishedProjects = achievements.map(
        (achievement) => achievement.finished_projects
      );
    }

    // Send the finished projects as response
    res.status(200).json({ finishedProjects });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch finished projects" });
  }
};

exports.updateFinishedProjects = async (req, res) => {
  try {
    const { finishedProjects } = req.body;

    // Check if there are any existing Achievement documents
    const existingAchievements = await Achievement.find({});

    if (existingAchievements.length === 0) {
      // If there are no existing documents, create a new one with the default value
      const newAchievement = new Achievement({
        finished_projects: finishedProjects,
      });
      await newAchievement.save();
    } else {
      // If there are existing documents, update the field in all documents
      await Achievement.updateMany({}, { finished_projects: finishedProjects });
    }

    res.status(200).json({
      message: "Finished projects updated successfully",
      finishedProjects: `${finishedProjects}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update finished projects" });
  }
};

exports.getStaff = async (req, res) => {
  try {
    // Fetch all Achievement documents
    const achievements = await Achievement.find({}, "staff");

    // If there are no achievements or if all achievements have no value for finished_projects,
    // return the default value
    let staff;
    if (
      achievements.length === 0 ||
      achievements.every((achievement) => !achievement.staff)
    ) {
      staff = ["0"];
    } else {
      // Extract finished projects from the documents
      staff = achievements.map((achievement) => achievement.staff);
    }

    // Send the finished projects as response
    res.status(200).json({ staff });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch number of staff" });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { staff } = req.body;

    // Check if there are any existing Achievement documents
    const existingAchievements = await Achievement.find({});

    if (existingAchievements.length === 0) {
      // If there are no existing documents, create a new one with the default value
      const newAchievement = new Achievement({
        staff: staff,
      });
      await newAchievement.save();
    } else {
      // If there are existing documents, update the field in all documents
      await Achievement.updateMany({}, { staff: staff });
    }

    res.status(200).json({
      message: "Finished projects updated successfully",
      staff: `${staff}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update finished projects" });
  }
};

exports.getExperience = async (req, res) => {
  try {
    // Fetch all Achievement documents
    const achievements = await Achievement.find(
      {},
      "finished_projects staff foundingDate"
    );

    // Extract the company experience years from each document
    const achievementDetails = achievements.map((achievement) => ({
      companyExperienceYears: achievement.companyExperienceYears, // Access the virtual property
    }));

    res.json({ achievementDetails });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch achievement details" });
  }
};
