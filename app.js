//Core Module
const express = require("express");
const contentRoutes = require("./routes/contentRoutes");
const cors = require("cors");

//User Define Module

const Db = require("./config/dbConfig");
const bannerRoutes = require("./routes/bannerRoutes");

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount image routes
app.use("/api/v1/banner", bannerRoutes, express.static("public/banner"));
app.use("/contents", express.static("public/contents"), contentRoutes);
app.use(
  "/api/v1/testimonial",
  express.static("public/testimonial"),
  require("./routes/testimonialRoutes")
);

app.use("/logo", express.static("public/logo"), require("./routes/logoRoutes"));
app.use("/api/v1/about-us", require("./routes/aboutUsRoutes"));
app.use("/api/v1/contact-us", require("./routes/contactUsRoutes"));

app.use("/achievements", require("./routes/achievementRoutes"));

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
