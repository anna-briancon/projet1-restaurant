const Order = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');

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