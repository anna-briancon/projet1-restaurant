const User = require('../models/user');
const Restaurant = require('../models/restaurant');

exports.createRestaurateur = async (req, res) => {
  try {
    const { name, address, postalCode, city, email, password } = req.body;
    const restaurateur = await User.create({
      name,
      address,
      postalCode,
      city,
      email,
      password,
      role: 'RESTAURANT'
    });

    const restaurant = await Restaurant.create({
      name: `Restaurant de ${name}`,
      address,
      postalCode,
      city,
      UserId: restaurateur.id
    });

    res.status(201).json({ restaurateur, restaurant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRestaurateurs = async (req, res) => {
  try {
    const restaurateurs = await User.findAll({
      where: { role: 'RESTAURANT' },
      include: Restaurant
    });
    res.json(restaurateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRestaurateur = async (req, res) => {
  try {
    const restaurateur = await User.findByPk(req.params.id);
    if (!restaurateur || restaurateur.role !== 'RESTAURANT') {
      return res.status(404).json({ message: 'Restaurateur not found' });
    }
    await restaurateur.destroy();
    res.json({ message: 'Restaurateur deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};