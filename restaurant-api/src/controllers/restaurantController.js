const Restaurant = require('../models/restaurant');
const User = require('../models/user');

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    await restaurant.update(req.body);
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 
      where: { UserId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'address', 'postalCode', 'city'] }]
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
