const Order = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Dish = require('../models/dish');
const Cart = require('../models/cart');
const OrderDish = require('../models/orderDish');
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Order.findAll({
      where: { RestaurantId: restaurant.id },
      include: [
        {
          model: User,
          as: 'Customer',
          attributes: ['email', 'name']
        },
        {
          model: Dish,
          as: 'Dishes',
          through: {
            model: OrderDish,
            as: 'OrderDish',
            attributes: ['quantity', 'price']
          },
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    const order = await Order.findOne({
      where: {
        id: id,
        RestaurantId: restaurant.id
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    await order.destroy();
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Dish, as: 'Dish' }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    const itemsByRestaurant = cartItems.reduce((acc, item) => {
      const restaurantId = item.Dish.RestaurantId;
      if (!acc[restaurantId]) {
        acc[restaurantId] = [];
      }
      acc[restaurantId].push(item);
      return acc;
    }, {});

    const orders = [];

    for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
      let totalPrice = 0;
      let itemCount = 0;
      items.forEach(item => {
        totalPrice += item.Dish.price * item.quantity;
        itemCount += item.quantity;
      });

      const order = await Order.create({
        userId,
        totalPrice,
        itemCount,
        UserId: req.user.id,
        RestaurantId: restaurantId,
        status: 'En attente'
      });

      const groupedDishes = items.reduce((acc, item) => {
        if (!acc[item.Dish.id]) {
          acc[item.Dish.id] = { dish: item.Dish, quantity: 0 };
        }
        acc[item.Dish.id].quantity += item.quantity;
        return acc;
      }, {});

      for (const [dishId, { dish, quantity }] of Object.entries(groupedDishes)) {
        await OrderDish.create({
          OrderId: order.id,
          DishId: dishId,
          quantity: quantity,
          price: dish.price
        });
      }

      orders.push({
        id: order.id,
        totalPrice: order.totalPrice,
        itemCount: order.itemCount,
        status: order.status,
        restaurantId: restaurantId
      });
    }

    await Cart.destroy({ where: { userId } });

    res.status(201).json({
      message: 'Commandes créées avec succès',
      orders: orders
    });
  } catch (error) {
    console.error('Erreur lors de la création des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: Restaurant,
          as: 'Restaurant',
          attributes: ['id', 'name']
        },
        {
          model: Dish,
          as: 'Dishes',
          through: {
            model: OrderDish,
            as: 'OrderDish',
            attributes: ['quantity', 'price']
          },
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }

};