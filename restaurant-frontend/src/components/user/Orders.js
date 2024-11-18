import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Calendar, CreditCard, Store } from 'lucide-react';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/user/orders', {
          headers: { Authorization: `Bearer ${token}` }
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

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#003670]"></div>
  </div>;

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#003670] mb-6">Mes Commandes</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Vous n'avez pas encore de commandes.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#003670]">Commande #{order.id}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Store className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.Restaurant.name}</p>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.totalPrice} €</p>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.itemCount} article{order.itemCount > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;