const express = require("express");
const aboutUs = require("../controllers/aboutUsController");

router = express.Router();

// router.post("/api/v1/AboutUs", aboutUs.createAboutUs);
router.get("/api/v1/AboutUs", aboutUs.getAboutUs);
router.put("/api/v1/:id", aboutUs.updateAboutUs);
// router.delete("/api/v1/:id", aboutUs.deleteAboutUs);

module.exports = router;
