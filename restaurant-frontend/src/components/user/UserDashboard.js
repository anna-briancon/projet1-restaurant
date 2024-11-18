import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

function UserDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/restaurant', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#003670]">Restaurants</h1>
        <Link
          to="/user/cart"
          className="flex items-center px-4 py-2 bg-[#003670] text-white rounded-full hover:bg-[#002550] transition-colors shadow-md"
        >
          <ShoppingCart className="mr-2" size={20} />
          Panier
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <div
            key={restaurant.id}
            className="relative h-64 lg:h-72 shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105"
            style={{
              backgroundImage: `url('./img-resto-${index % 7}.jpg')`, // Choix cyclique de l'image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Link to={`/user/restaurant/${restaurant.id}`}>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
                <p className="text-gray-200 mt-1">{restaurant.city}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
