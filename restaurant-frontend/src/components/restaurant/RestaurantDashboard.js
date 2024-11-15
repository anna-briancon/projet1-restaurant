import React from 'react';
import { Utensils } from 'lucide-react';

function RestaurantDashboard() {
  const restaurantInfo = JSON.parse(localStorage.getItem('restaurantInfo')) || {};

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#003670] mb-8">Tableau de bord</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Utensils className="text-[#003670] mr-4" size={48} />
          <div>
            <h2 className="text-2xl font-semibold text-[#003670]">{restaurantInfo.name}</h2>
            <p className="text-[#003670] opacity-75">{restaurantInfo.address}</p>
          </div>
        </div>
        <p className="text-[#003670] mb-4">{restaurantInfo.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F0F8FF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#003670] mb-2">Nombre de plats</h3>
            <p className="text-3xl font-bold text-[#003670]">{restaurantInfo.dishCount || 0}</p>
          </div>
          <div className="bg-[#F0F8FF] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#003670] mb-2">Commandes en cours</h3>
            <p className="text-3xl font-bold text-[#003670]">{restaurantInfo.activeOrders || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;