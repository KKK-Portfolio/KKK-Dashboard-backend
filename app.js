//Core Module
const express = require("express");

//User Define Module

const contactUsRoutes = require("./routes/contactUsRoutes");

const Db = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/contact-us", require("./routes/contactUsRoutes"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
