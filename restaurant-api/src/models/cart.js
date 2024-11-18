const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
    userId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dishId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity : {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'cart',
    timestamps: true
});

Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
    });
    Cart.belongsTo(models.Dish, {
        foreignKey: 'dishId',
        as: 'Dish'
    });
};

module.exports = Cart;