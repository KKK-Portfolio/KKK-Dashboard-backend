//Core Module
const express = require("express");

//User Define Module

const Db = require("./config/dbConfig");
const bannerRoutes = require("./routes/bannerRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));

// Mount image routes
app.use("/api/v1/banner", bannerRoutes, express.static("public/img"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
