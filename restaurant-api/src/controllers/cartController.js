const Cart = require('../models/cart');
const Dish = require('../models/dish');

exports.addToCart = async (req, res) => {
  try {
    const { dishId, quantity } = req.body;
    const userId = req.user.id;

    const dish = await Dish.findByPk(dishId);

    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }

    if (!dish.RestaurantId) {
      return res.status(400).json({ message: 'Informations du restaurant manquantes pour ce plat' });
    }

    let cartItem = await Cart.findOne({ where: { userId, dishId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        dishId,
        restaurantId: dish.RestaurantId,
        quantity
      });
    }

    const fullCart = await Cart.findAll({
      where: { userId },
      include: [{ 
        model: Dish,
        as: 'Dish',
        attributes: ['name', 'price', 'RestaurantId']
      }]
    });

    res.status(201).json({
      message: 'Plat ajouté au panier avec succès',
      addedItem: {
        id: cartItem.id,
        dishId: cartItem.dishId,
        restaurantId: cartItem.restaurantId,
        quantity: cartItem.quantity
      },
      fullCart: fullCart.map(item => ({
        id: item.id,
        dishId: item.dishId,
        restaurantId: item.restaurantId,
        quantity: item.quantity,
        dish: {
          name: item.Dish.name,
          price: item.Dish.price,
          restaurantId: item.Dish.RestaurantId
        }
      }))
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findAll({
      where: { userId },
      include: [{ 
        model: Dish,
        as: 'Dish',
        attributes: ['name', 'price', 'RestaurantId'] 
      }]
    });

    res.json(cart.map(item => ({
      id: item.id,
      dishId: item.dishId,
      restaurantId: item.restaurantId,
      quantity: item.quantity,
      dish: {
        name: item.Dish.name,
        price: item.Dish.price,
        restaurantId: item.Dish.RestaurantId
      }
    })));
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id, userId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item du panier non trouvé' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élément du panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id, userId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item du panier non trouvé' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item supprimé du panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id, userId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item du panier non trouvé' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item supprimé du panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}