import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronLeft, Trash2 } from 'lucide-react';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:8081/api/user/cart', { headers });

        console.log('Cart response:', response.data);

        const cartData = await Promise.all(response.data.map(async (item) => {
          const dishRes = await axios.get(`http://localhost:8081/api/dishes/${item.dishId}`, { headers });
          console.log('Dish response:', dishRes.data);

          const restaurantRes = await axios.get(`http://localhost:8081/api/restaurant/${dishRes.data.RestaurantId}`, { headers });
          console.log('Restaurant response:', restaurantRes.data);

          return {
            ...item,
            dish: {
              ...dishRes.data,
              photoBase64: dishRes.data.photo ? `data:image/jpeg;base64,${arrayBufferToBase64(dishRes.data.photo.data)}` : null
            },
            restaurant: restaurantRes.data,
            restaurantId: dishRes.data.RestaurantId
          };
        }));

        setCart(cartData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du panier:', err);
        setError('Erreur lors du chargement du panier');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);


  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8081/api/user/orders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setCart([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      setError('Erreur lors de la création de la commande');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?");

    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8081/api/user/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'item:', err);
        setError('Erreur lors de la suppression de l\'item');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#003670]"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    );

  const cartByRestaurant = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurant: item.restaurant,
        items: []
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#003670]">Mon Panier</h1>
      </div>
      {Object.keys(cartByRestaurant).length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Votre panier est vide.</p>
      ) : (
        <>
          {Object.values(cartByRestaurant).map(({ restaurant, items }) => (
            <div key={restaurant.id} className="mb-8 bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-[#003670] text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-[#A7C7E7]">{restaurant.address}, {restaurant.postalCode} {restaurant.city}</p>
              </div>
              <div className="p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex items-center">
                      {item.dish.photoBase64 && (
                        <img src={item.dish.photoBase64} alt={item.dish.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-[#003670]">{item.dish.name}</h3>
                        <p className="text-gray-600">Quantité : {item.quantity}</p>
                        <p className="text-[#003670] font-bold">{(item.dish.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-6">
                <p className="text-xl font-bold text-[#003670] text-right">
                  Total du restaurant : {items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
          <div className="mt-6 p-6 bg-white shadow-lg rounded-2xl">
            <p className="text-2xl font-bold text-[#003670] text-center mb-6">
              Total de la commande : {Object.values(cartByRestaurant).reduce((sum, { items }) => sum + items.reduce((itemSum, item) => itemSum + item.dish.price * item.quantity, 0), 0).toFixed(2)} €
            </p>
            <button
              onClick={handleCheckout}
              className="w-full px-6 py-3 bg-[#003670] text-white text-lg font-semibold rounded-full hover:bg-[#002550] transition-colors shadow-md"
            >
              Payer
            </button>
          </div>
        </>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-full text-center animate-fade-in-out">
          Commande créée avec succès !
        </div>
      )}
    </div>
  );
}

export default Cart;