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
            Authorization: `Bearer ${token}`
          }
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

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003670]">Restaurants</h1>
        <Link to="/user/cart" className="flex items-center px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-[#003670]">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
            <div className="p-4 border-t border-gray-200">
              <p className="text-gray-700">{restaurant.description}</p>
            </div>
            <div className="p-4 bg-gray-50">
              <Link 
                to={`/user/restaurant/${restaurant.id}`}
                className="block w-full text-center px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors"
              >
                Voir le menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;