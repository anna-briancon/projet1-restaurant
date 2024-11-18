const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dish = sequelize.define('Dish', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  photo: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'dishes',
  timestamps: true
});

Dish.associate = (models) => {
  Dish.belongsTo(models.Restaurant, {
    foreignKey: 'RestaurantId',
    as: 'Restaurant'
  });
  Dish.hasMany(models.Cart, {
    foreignKey: 'dishId',
    as: 'Cart'
  });
  Dish.belongsToMany(models.Order, {
    through: 'OrderDish',
    as: 'Orders'
  });
};

module.exports = Dish;