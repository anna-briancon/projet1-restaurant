const Dish = require('../models/dish');
const Restaurant = require('../models/restaurant');

exports.createDish = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const photo = req.file ? req.file.buffer : null;

    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé pour cet utilisateur' });
    }

    const dish = await Dish.create({
      name,
      photo,
      price,
      description,
      RestaurantId: restaurant.id  
    });

    res.status(201).json(dish);
  } catch (error) {
    console.error('Erreur lors de la création du plat:', error);
    res.status(500).json({ message: 'serveur erreur' });
  }
};

exports.getDishes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const restaurant = await Restaurant.findOne({ where: { UserId: req.user.id } });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé pour cet utilisateur' });
    }
    const dishes = await Dish.findAll({
      where: { RestaurantId: restaurant.id },
      include: {
        model: Restaurant,
        as: 'Restaurant',
        attributes: ['name']
      }
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé pour cet utilisateur' });
    }
    const dish = await Dish.findOne({ 
      where: { 
        id: id,
        RestaurantId: restaurant.id 
      }
    });
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé ou non autorisé' });
    }
    await dish.destroy();
    res.status(200).json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du plat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByPk(id, {
      include: {
        model: Restaurant,
        as: 'Restaurant',
        attributes: ['name']
      }
    });
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(dish);
  } catch (error) {
    console.error('Erreur lors de la récupération du plat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};