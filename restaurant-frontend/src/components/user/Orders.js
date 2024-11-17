import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003670] mb-6">Mes Commandes</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-[#003670]">Commande #{order.id}</h2>
            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="mt-2">Restaurant: {order.restaurant.name}</p>
            <p>Total: {order.totalPrice} €</p>
            <p>Statut: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;