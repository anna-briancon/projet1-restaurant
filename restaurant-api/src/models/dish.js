const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dish = sequelize.define('Dish', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'dishes',
  timestamps: true
});

module.exports = Dish;