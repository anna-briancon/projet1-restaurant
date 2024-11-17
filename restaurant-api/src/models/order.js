const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  itemCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: true
});

Order.associate = (models) => {
  Order.belongsTo(models.User, {
    foreignKey: 'UserId',
    as: 'Customer'
  });
  Order.belongsTo(models.Restaurant, {
    foreignKey: 'RestaurantId',
    as: 'Restaurant'
  });
};

module.exports = Order;