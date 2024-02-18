//Core Module
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

//User Define Module

const Db = require("./config/dbConfig");
const imageuploadRoutes = require("./routes/imageuploadRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

// Set up CORS middleware to allow requests from any origin
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specified HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
  })
);

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));

// Mount image routes
app.use("/images", imageuploadRoutes, express.static("public/img"));
// Serve static files from the 'public/img' directory
// app.use('/images', express.static('public/img'));

app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
