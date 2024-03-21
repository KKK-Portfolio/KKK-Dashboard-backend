const express = require("express");
const aboutUs = require("../controllers/aboutUsController");

router = express.Router();

// router.post("/", aboutUs.createAboutUs);
router.get("/", aboutUs.getAboutUs);
router.put("/:id", aboutUs.updateAboutUs);
// router.delete("/:id", aboutUs.deleteAboutUs);

module.exports = router;
