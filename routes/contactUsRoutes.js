//Core module

const express = require("express");
const contactUsController = require("../controllers/contactUsController");

const router = express.Router();

router.post("/submit", contactUsController.formSubmit);
router.get("/:id", contactUsController.submittedForm);
router.get("/", contactUsController.getAllForm);
router.delete("/:id", contactUsController.deleteForm);

module.exports = router;
