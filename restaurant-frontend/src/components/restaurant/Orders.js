import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/orders/restaurant', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(response.data);
            setError(null);
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes', error);
            setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        try {
          await axios.delete(`http://localhost:8081/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
          console.error('Erreur lors de la suppression de la commande', error);
          alert('Impossible de supprimer la commande. Veuillez réessayer plus tard.');
        }
      }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#003670] mb-6">Commandes reçues</h2>
            {loading && (
                <p className="text-[#003670]">Chargement des commandes...</p>
            )}
            {error && (
                <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
            )}
            {!loading && !error && orders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#A7C7E7]">
                        <thead className="bg-[#F0F8FF]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Email du client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Nb d'articles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#A7C7E7]">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.Customer.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.totalPrice} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.itemCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                                        >
                                            <Trash2 className="mr-1" size={16} />
                                            Annuler la commande
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && !error && orders.length === 0 && (
                <p className="text-[#003670] bg-[#F0F8FF] p-4 rounded">Aucune commande trouvée.</p>
            )}
        </div>
    );
}

export default Orders;