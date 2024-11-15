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
  try {
    const { id } = req.params;
    const restaurateur = await User.findOne({
      where: { id, role: 'RESTAURANT' },
      include: [{ model: Restaurant, as: 'Restaurant' }]
    });

    if (!restaurateur) {
      return res.status(404).json({ message: 'Restaurateur not found' });
    }

    if (restaurateur.Restaurant) {
      await restaurateur.Restaurant.destroy();
    }
    await restaurateur.destroy();

    res.json({ message: 'Restaurateur and associated restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurateur:', error);
    res.status(500).json({ message: 'Error deleting restaurateur', error: error.message });
  }
};