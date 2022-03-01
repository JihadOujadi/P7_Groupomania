require("dotenv").config({ path: "./config/.env" });
const { Sequelize } = require("sequelize");
const mysql = require("mysql");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_ROOT,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);
try {
  sequelize.authenticate();
  console.log("Connecté à la base de données MySQL!");
} catch (error) {
  console.error("Impossible de se connecter, erreur suivante :", error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.messages = require("../models/message")(sequelize, Sequelize);
db.users = require("../models/user")(sequelize, Sequelize);
module.exports = db;
