import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

function Dishes() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/dishes', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDishes(response.data);
            setError(null);
        } catch (error) {
            console.error('Erreur lors de la récupération des plats', error);
            setError('Impossible de charger les plats. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
            try {
                await axios.delete(`http://localhost:8081/api/dishes/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDishes(dishes.filter(dish => dish.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du plat', error);
                alert('Impossible de supprimer le plat. Veuillez réessayer plus tard.');
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#003670]">Liste des plats</h2>
                <Link 
                    to="/restaurant/add-dish" 
                    className="bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors duration-200"
                >
                    <Plus className="mr-2" size={18} />
                    Ajouter un plat
                </Link>
            </div>
            {loading && (
                <p className="text-[#003670]">Chargement des plats...</p>
            )}
            {error && (
                <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
            )}
            {!loading && !error && dishes.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#A7C7E7]">
                        <thead className="bg-[#F0F8FF]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Prix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#003670] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#A7C7E7]">
                            {dishes.map((dish) => (
                                <tr key={dish.id} className="">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{dish.name}</td>
                                    <td className="px-6 py-4 text-sm text-[#003670]">{dish.photo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003670]">{dish.price} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleDelete(dish.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                                            >
                                                <Trash2 className="mr-1" size={16} />
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && !error && dishes.length === 0 && (
                <p className="text-[#003670] bg-[#F0F8FF] p-4 rounded">Aucun plat trouvé.</p>
            )}
        </div>
    );
}

export default Dishes;