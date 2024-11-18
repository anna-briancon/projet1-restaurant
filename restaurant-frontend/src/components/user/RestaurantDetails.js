import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronLeft } from 'lucide-react';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndDishes = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [restaurantRes, dishesRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/restaurant/${id}`, { headers }),
          axios.get(`http://localhost:8081/api/restaurant/${id}/dishes`, { headers })
        ]);

        const restaurantData = restaurantRes.data;
        setRestaurant(restaurantData);

        const dishesData = dishesRes.data.map((dish) => {
          if (dish.photo && dish.photo.data) {
            dish.photoBase64 = `data:image/jpeg;base64,${arrayBufferToBase64(dish.photo.data)}`;
          }
          return dish;
        });
        setDishes(dishesData);

        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchRestaurantAndDishes();
  }, [id]);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#003670] hover:text-[#002550] transition-colors"
        >
          <ChevronLeft className="mr-1" size={20} />
          Retour à la liste des restaurants
        </button>
        <Link
          to="/user/cart"
          className="flex items-center px-4 py-2 bg-[#003670] text-white rounded-full hover:bg-[#002550] transition-colors shadow-md"
        >
          <ShoppingCart className="mr-2" size={20} />
          Panier
        </Link>
      </div>
      <div className="mb-8 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-[#003670] text-white p-8">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-[#A7C7E7]">{restaurant.address}, {restaurant.postalCode} {restaurant.city}</p>
        </div>
      </div>
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold text-[#003670] mr-4">Menu</h2>
        <div className="flex-grow h-0.5 bg-[#003670]"></div>
      </div>
      {dishes.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">Aucun plat n'est disponible pour ce restaurant.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <Link key={dish.id} to={`/user/dish/${dish.id}`} className="block">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105">
                {dish.photoBase64 && (
                  <img
                    src={dish.photoBase64}
                    alt={dish.name}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#003670] mb-2">{dish.name}</h3>
                  <p className="text-[#003670] text-xl font-bold mb-4">
                    {typeof dish.price === 'number'
                      ? dish.price.toFixed(2)
                      : parseFloat(dish.price).toFixed(2)}{' '}
                    €
                  </p>
                  <p className="text-gray-600 h-20 overflow-hidden">
                    {dish.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantDetails;
