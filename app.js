//Core Module
const express = require("express");
const path = require("path");

//User Define Module

const Db = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/logo", express.static("public/logo"), require("./routes/logoRoutes"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
