'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.Message, {
        foreignKey: {
          name: "messageId",
          allowNull: false
        }
      });
      models.Like.belongsTo(models.User, {
        foreignKey: 
        {
          name: "userId",
          allowNull: false
        }
      })
    }
  }
  Like.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};