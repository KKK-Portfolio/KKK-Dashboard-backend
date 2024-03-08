// Core Modules
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");

// User Defined Modules
const Db = require("./config/dbConfig");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to the database
Db();

// Set up CORS middleware to allow requests from any origin
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specified HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Middleware to parse incoming cookies
// app.use(cookieParser());

// Middleware for session management
// app.use(
//   session({
//     secret: "keyboard cat", // Secret for session encryption
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI, // MongoDB connection URI
//     }),
//     cookie: {
//       maxAge: 3600000, // Cookie expiration time (1 hour)
//       secure: false, // Set to true if HTTPS is used
//       sameSite: "lax", // Set to "strict" or "none" based on your requirements
//     },
//   })
// );

// Middleware to log parsed cookies
// app.use((req, res, next) => {
//   console.log("Parsed Cookies:", req.cookies);
//   next();
// });

// Mount image routes and serve static files
app.use("/images", imageRoutes, express.static("public/img"));

// Mount other routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/adminRoutes"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT}...`);
});
