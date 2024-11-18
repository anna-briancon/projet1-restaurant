import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import axios from 'axios';

function RestaurantDashboard() {
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [dishCount, setDishCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const [restaurantResponse, dishesResponse, ordersResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/restaurant/info', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8081/api/dishes', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8081/api/orders/restaurant', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setRestaurantInfo(restaurantResponse.data);
        setDishCount(dishesResponse.data.length);
        setOrderCount(ordersResponse.data.length);
        setLoading(false);

        localStorage.setItem('restaurantInfo', JSON.stringify(restaurantResponse.data));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch restaurant data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#003670] mb-8">Tableau de bord</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Utensils className="text-[#003670] mr-4" size={48} />
          <div>
            <h2 className="text-2xl font-semibold text-[#003670]">{restaurantInfo.name}</h2>
            <p className="text-[#003670] opacity-75">{restaurantInfo.address}</p>
            <p className="text-[#003670] opacity-75">{restaurantInfo.postalCode} {restaurantInfo.city}</p>
          </div>
        </div>
        <p className="text-[#003670] mb-4">{restaurantInfo.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F0F8FF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#003670] mb-2">Nombre de plats</h3>
            <p className="text-3xl font-bold text-[#003670]">{dishCount}</p>
          </div>
          <div className="bg-[#F0F8FF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#003670] mb-2">Nombre de commandes</h3>
            <p className="text-3xl font-bold text-[#003670]">{orderCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;