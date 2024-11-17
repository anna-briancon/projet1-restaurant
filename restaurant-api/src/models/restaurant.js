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

Restaurant.associate = (models) => {
  Restaurant.belongsTo(models.User, { 
    foreignKey: 'UserId',
    as: 'User'
  });
  Restaurant.hasMany(models.Dish, {
    foreignKey: 'RestaurantId',
    as: 'Dishes'
  });
  Restaurant.belongsTo(models.User, {
    foreignKey: 'UserId',
    as: 'Owner'
  });
  Restaurant.hasMany(models.Order, {
    foreignKey: 'RestaurantId',
    as: 'Orders'
  });
};

module.exports = Restaurant;