const express = require("express");
const mysql = require("mysql");
const db = require("./db/db");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const models = require("./models");
const postsRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
require("dotenv").config({ path: "./config/.env" });

const app = express();
app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

models.sequelize.sync();

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/posts/", postsRoutes);
app.use("/api/users/", userRoutes);

module.exports = app;
