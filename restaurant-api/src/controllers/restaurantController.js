const e = require('express');
const Restaurant = require('../models/restaurant');

exports.getRestaurantInfo = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      name: restaurant.name,
    });
  } catch (error) {
    console.error('Error fetching restaurant info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.name = name;
    restaurant.address = address;
    restaurant.description = description;

    await restaurant.save();

    res.json({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getRestaurantInfoUser = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
    });
  } catch (error) {
    console.error('Error fetching restaurant info:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getDishes = async (req, res) => { 
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const dishes = await restaurant.getDishes();

    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
