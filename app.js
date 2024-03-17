//Core Module
const express = require("express");
const cors = require("cors");

//User Define Module

const Db = require("./config/dbConfig");

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
app.use(express.json());

app.use("/api/v1/users", require("./routes/authRoutes"));
app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
