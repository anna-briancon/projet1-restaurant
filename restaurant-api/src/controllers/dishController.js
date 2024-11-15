const Dish = require('../models/dish');
const Restaurant = require('../models/restaurant');

exports.createDish = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.UserId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to add dishes to this restaurant' });
    }

    const dish = await Dish.create({ ...req.body, RestaurantId: restaurantId });
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDishes = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const dishes = await Dish.findAll({ where: { RestaurantId: restaurantId } });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};