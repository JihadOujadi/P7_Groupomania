'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Message, Comment, Like}) {
      // define association here
      this.hasMany(Message, { foreignKey: {
        name: "userId",
        allowNull: false
      }});
      this.hasMany(Comment, { foreignKey: {
        name: "userId",
        allowNull: false
      }});
      // this.hasMany(Like, { foreignKey: 'userId', as: 'likes' })
    }
    
  }
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    pictures: {type: DataTypes.STRING,
    defaultValue: ''},
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};