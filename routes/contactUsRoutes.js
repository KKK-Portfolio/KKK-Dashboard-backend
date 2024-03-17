//Core module

const express = require("express");
const contactUsController = require("../controllers/contactUsController");

const router = express.Router();

router.post("/api/v1/submit", contactUsController.formSubmit);
router.get("/api/v1/:id", contactUsController.submittedForm);
router.get("/api/v1", contactUsController.getAllForm);
router.delete("/api/v1/:id", contactUsController.deleteForm);

module.exports = router;
