const express = require("express");
const achievements = require("../controllers/achievementController");

const router = express.Router();

router.get("/api/v1/projects", achievements.getFinishedProjects);
router.get("/api/v1/staffs", achievements.getStaff);
router.put("/api/v1/projects", achievements.updateFinishedProjects);
router.put("/api/v1/staffs", achievements.updateStaff);
router.get("/api/v1/year", achievements.getExperience);

module.exports = router;
