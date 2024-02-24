//Core Module
const express = require("express");
// const contentRoutes = require("./routes/contentRoutes");

//User Define Module

const Db = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
