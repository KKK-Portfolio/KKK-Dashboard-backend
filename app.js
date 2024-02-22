//Core Module
const express = require("express");
const contentRoutes = require("./routes/contentRoutes");

//User Define Module

const Db = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));

app.use("/contents", contentRoutes, express.static("public/contents"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
