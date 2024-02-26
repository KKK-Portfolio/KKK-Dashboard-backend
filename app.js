//Core Module
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//User Define Module

const Db = require("./config/dbConfig");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

//connected to database
Db();

//passing the data using middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: new Date(Date.now() + 3600000) },
  })
);

// Mount image routes
app.use("/images", imageRoutes, express.static("public/img"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
