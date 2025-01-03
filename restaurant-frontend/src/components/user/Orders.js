import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Calendar, CreditCard, Store, ChevronDown, ChevronUp } from 'lucide-react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/user/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const ordersWithDishes = await Promise.all(response.data.map(async (order) => {
          const dishesWithImages = await Promise.all(order.Dishes.map(async (dish) => {
            const dishResponse = await axios.get(`http://localhost:8081/api/dishes/${dish.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const dishData = dishResponse.data;
            if (dishData.photo && dishData.photo.data) {
              dishData.photoBase64 = `data:image/jpeg;base64,${arrayBufferToBase64(dishData.photo.data)}`;
            }
            return { ...dish, ...dishData };
          }));
          return { ...order, Dishes: dishesWithImages };
        }));

        setOrders(ordersWithDishes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Erreur lors du chargement des commandes');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#003670]"></div>
    </div>
  );

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
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="text-[#003670] hover:text-[#A7C7E7] transition-colors duration-200"
                  >
                    {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Store className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.Restaurant?.name || 'Restaurant inconnu'}</p>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.totalPrice || '0.00'} €</p>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{order.itemCount || 0} article{order.itemCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#003670]" />
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2">Détails de la commande :</h4>
                    {order.Dishes && order.Dishes.length > 0 ? (
                      <ul className="space-y-2">
                        {order.Dishes.map(dish => (
                          <li key={dish.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                              {dish.photoBase64 ? (
                                <img 
                                  src={dish.photoBase64}
                                  alt={dish.name} 
                                  className="w-12 h-12 object-cover rounded-lg mr-2" 
                                  onError={(e) => {
                                    console.error('Error loading image:', e);
                                    e.target.src = '/placeholder.svg?height=48&width=48';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-2 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">No image</span>
                                </div>
                              )}
                              <span>{dish.name}</span>
                            </div>
                            <span>{dish.OrderDish.quantity} x {dish.OrderDish.price} €</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucun détail disponible pour cette commande.</p>
                    )}
                    <div className="mt-4 text-right font-semibold">
                      Total : {order.totalPrice || '0.00'} €
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;