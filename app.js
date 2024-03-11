//Core Module
const express = require("express");
const cors = require("cors");

//User Define Module

const Db = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specified HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
    credentials: true, // Allow cookies to be sent with requests
  })
);

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json());

app.use("/logo", express.static("public/logo"), require("./routes/logoRoutes"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
