import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const [restaurantRes, dishesRes] = await Promise.all([
            axios.get(`http://localhost:8081/api/restaurant/${id}`, { headers }),
            axios.get(`http://localhost:8081/api/restaurant/${id}/dishes`, { headers })
        ]);
        setRestaurant(restaurantRes.data);
        setDishes(dishesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchRestaurantAndDishes();
  }, [id]);

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003670] mb-6">{restaurant.name}</h1>
      <p className="mb-4 text-gray-600">{restaurant.description}</p>
      <h2 className="text-2xl font-bold text-[#003670] mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#003670]">{dish.name}</h3>
              <p className="text-gray-600">{dish.description}</p>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="font-bold text-[#003670]">{dish.price} €</p>
              <Link 
                to={`/user/dish/${dish.id}`}
                className="mt-2 block w-full text-center px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors"
              >
                Voir détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDetails;