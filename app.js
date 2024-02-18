//Core Module
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//User Define Module

const Db = require("./config/dbConfig");
const imageuploadRoutes = require("./routes/imageuploadRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));

// Mount image routes
app.use("/images", imageuploadRoutes);

app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
