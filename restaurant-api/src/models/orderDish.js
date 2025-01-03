const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderDish = sequelize.define('OrderDish', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
    }, {
    tableName: 'OrderDish',
    timestamps: true
    });

module.exports = OrderDish;