"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Message, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
      models.User.hasMany(models.Comment, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
      models.User.hasMany(models.Like, { foreignKey: "userId", as: "likes" });
    }
  }
  User.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      pictures: { type: DataTypes.STRING, defaultValue: "" },
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
