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