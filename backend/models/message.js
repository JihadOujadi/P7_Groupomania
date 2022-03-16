"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Comment}) {
      // define association here
      this.belongsTo(User, {
        foreignKey: {
          name: "userId",
          allowNull: false
        }
      });
      this.hasMany(Comment, {
        foreignKey: {
          name: "messageId",
          allowNull: false
        }
      });
      
    }
    
  }
  Message.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      image: DataTypes.STRING,
      likes: {type: DataTypes.INTEGER,
        defaultValue: 0}
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
