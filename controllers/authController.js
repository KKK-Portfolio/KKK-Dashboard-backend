const User = require("../models/userModel");
const authController = require("../models/userModel");
const asyncErrorHandler = require("../utlis/asyncErrorHandler");

exports.signup = asyncErrorHandler(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 201,
    message: "success",
    data: { user: newUser },
  });
});
