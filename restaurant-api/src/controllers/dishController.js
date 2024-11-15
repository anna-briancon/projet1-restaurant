const Dish = require('../models/dish');
const Restaurant = require('../models/restaurant');

exports.createDish = async (req, res) => {
  try {
    const { name, photo, price } = req.body;

    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this user' });
    }

    const dish = await Dish.create({
      name,
      photo,
      price,
      RestaurantId: restaurant.id  
    });

    console.log('Created dish:', dish.toJSON());

    res.status(201).json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDishes = async (req, res) => {
  try {
      const dishes = await Dish.findAll({
          include: {
              model: Restaurant,
              as: 'Restaurant',
              attributes: ['name']
          }
      });

      res.json(dishes);
  } catch (error) {
      console.error('Error fetching dishes:', error);
      res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver d'abord le restaurant associé à l'utilisateur connecté
    const restaurant = await Restaurant.findOne({ where: { userId: req.user.id } });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé pour cet utilisateur' });
    }

    // Chercher le plat avec l'ID fourni et appartenant au restaurant de l'utilisateur
    const dish = await Dish.findOne({ 
      where: { 
        id: id,
        RestaurantId: restaurant.id 
      }
    });

    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé ou non autorisé' });
    }

    // Supprimer le plat
    await dish.destroy();
    
    res.status(200).json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du plat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};