//Core Module
const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//User Define Module
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const jwtsecret = process.env.JWT_SECRET;
router.use(express.json());

//GET
//Admin LOGIN_PAGE
router.get("/api/v1/login", (req, res) => {
  res.send("This is admin login page");
});

//POST
//Admin Check-login

router.post("/api/v1/login", async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtsecret);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ status: 200, message: "success", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//POST
//Admin Register

router.post("/api/v1/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User created.", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server errors" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", (req, res) => {
  res.send("This is Dashboard...");
});

router.get("/add-post", (req, res) => {
  res.send("This is add-post...");
});

router.get("/update-post", (req, res) => {
  res.send("This is update-post...");
});

router.get("/delete-post", (req, res) => {
  res.send("This is Delete...");
});
module.exports = router;
