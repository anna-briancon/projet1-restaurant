const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Dish = require('../models/dish');
const Order = require('../models/order');
const sequelize = require('../config/database');

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
      name: `${name}`,
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
    console.log('Début de getAllRestaurateurs');
    const restaurateurs = await User.findAll({
      where: { role: 'RESTAURANT' },
      include: [{ model: Restaurant, as: 'Restaurant' }]
    });
    console.log('Restaurateurs trouvés:', JSON.stringify(restaurateurs, null, 2));
    res.json(restaurateurs);
  } catch (error) {
    console.error('Erreur dans getAllRestaurateurs:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteRestaurateur = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const restaurateur = await User.findOne({
      where: { id, role: 'RESTAURANT' },
      include: [{ model: Restaurant, as: 'Restaurant' }]
    });

    if (!restaurateur) {
      await t.rollback();
      return res.status(404).json({ message: 'Restaurateur not found' });
    }

    if (restaurateur.Restaurant) {
      await Dish.destroy({
        where: { RestaurantId: restaurateur.Restaurant.id },
        transaction: t
      });

      await Order.destroy({
        where: { RestaurantId: restaurateur.Restaurant.id },
        transaction: t
      });

      await restaurateur.Restaurant.destroy({ transaction: t });
    }

    await restaurateur.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Restaurateur, restaurant, dishes, and orders deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting restaurateur:', error);
    res.status(500).json({ message: 'Error deleting restaurateur', error: error.message });
  }
};