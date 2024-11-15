const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Dish = require('./dish');

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'restaurants',
  timestamps: true
});

Restaurant.hasMany(Dish);
Dish.belongsTo(Restaurant);

module.exports = Restaurant;