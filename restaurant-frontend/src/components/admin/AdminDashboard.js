import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Plus, Trash2 } from 'lucide-react';

function AdminDashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/restaurateurs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRestaurants(response.data);
            setError(null);
        } catch (error) {
            console.error('Erreur lors de la récupération des restaurants', error);
            setError('Impossible de charger les restaurants. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
            try {
                await axios.delete(`http://localhost:8081/api/restaurateurs/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du restaurant', error);
                alert('Impossible de supprimer le restaurant. Veuillez réessayer plus tard.');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#003670]">Restaurants</h2>
                    <Link 
                        to="/admin/add-restaurant" 
                        className="bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors duration-200"
                    >
                        <Plus className="mr-2" size={18} />
                        Ajouter un restaurateur
                    </Link>
                </div>
                {loading && (
                    <p className="text-[#003670]">Chargement des restaurants...</p>
                )}
                {error && (
                    <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
                )}
                {!loading && !error && restaurants.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#A7C7E7]">
                            <thead className="bg-[#F0F8FF]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Ville</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Adresse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Code Postal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#A7C7E7]">
                                {restaurants.map((restaurant) => (
                                    <tr key={restaurant.id} className="hover:bg-[#F0F8FF] transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{restaurant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{restaurant.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{restaurant.city}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{restaurant.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{restaurant.postalCode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDelete(restaurant.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                                            >
                                                <Trash2 className="mr-1" size={16} />
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && !error && restaurants.length === 0 && (
                    <p className="text-[#003670] bg-[#F0F8FF] p-4 rounded">Aucun restaurant trouvé.</p>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;