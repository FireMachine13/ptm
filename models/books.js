'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Books.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    editory: DataTypes.STRING,
    autor: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Books',
  });
  return Books;
};