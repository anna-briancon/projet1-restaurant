import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8081/api/orders/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut de la commande');
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#003670] mb-6">Commandes</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#003670]">Commande #{order.id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                order.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
                order.status === 'ready' ? 'bg-green-200 text-green-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-[#003670] mb-2">Plats commandés:</h3>
              <ul className="list-disc list-inside">
                {order.dishes.map(dish => (
                  <li key={dish.id} className="text-[#003670]">{dish.name} - {dish.quantity}x</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#003670] font-bold">Total: {order.totalAmount} €</p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="bg-[#F0F8FF] border border-[#A7C7E7] text-[#003670] rounded-md px-3 py-2"
              >
                <option value="pending">En attente</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prêt</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;