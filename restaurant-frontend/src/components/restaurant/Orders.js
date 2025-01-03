import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/orders/restaurant', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Response data:', response.data);

            if (!Array.isArray(response.data)) {
                console.error('La réponse n\'est pas un tableau:', response.data);
                setError('Format de réponse inattendu. Veuillez réessayer plus tard.');
                setLoading(false);
                return;
            }

            const ordersWithDishes = await Promise.all(response.data.map(async (order) => {
                if (!order.Dishes || !Array.isArray(order.Dishes)) {
                    console.error('Les plats ne sont pas un tableau pour la commande:', order);
                    return order;
                }

                const dishesWithImages = await Promise.all(order.Dishes.map(async (dish) => {
                    try {
                        const dishResponse = await axios.get(`http://localhost:8081/api/dishes/${dish.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const dishData = dishResponse.data;
                        if (dishData.photo && dishData.photo.data) {
                            dishData.photoBase64 = `data:image/jpeg;base64,${arrayBufferToBase64(dishData.photo.data)}`;
                        }
                        return { ...dish, ...dishData };
                    } catch (error) {
                        console.error('Erreur lors de la récupération des détails du plat:', error);
                        return dish;
                    }
                }));
                return { ...order, Dishes: dishesWithImages };
            }));

            setOrders(ordersWithDishes);
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

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#A7C7E7]">
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.Customer?.email || 'Email non disponible'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.totalPrice} €</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{order.itemCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => toggleOrderDetails(order.id)}
                                                className="text-[#003670] hover:text-[#A7C7E7] transition-colors duration-200 flex items-center w-20"
                                            >
                                                {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                {expandedOrder === order.id ? 'Masquer les détails' : 'Voir les détails'}
                                            </button>
                                        </td>
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
                                    {expandedOrder === order.id && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
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
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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