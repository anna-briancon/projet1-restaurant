import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash } from 'lucide-react';

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/dishes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDishes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des plats');
      setLoading(false);
    }
  };

  const handleAddDish = () => {
    // Implement add dish functionality
  };

  const handleEditDish = (id) => {
    // Implement edit dish functionality
  };

  const handleDeleteDish = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        await axios.delete(`http://localhost:8081/api/dishes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDishes(dishes.filter(dish => dish.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression du plat');
      }
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003670]">Plats</h1>
        <button
          onClick={handleAddDish}
          className="bg-[#003670] hover:bg-[#A7C7E7] text-white hover:text-[#003670] font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un plat
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(dish => (
          <div key={dish.id} className="bg-white rounded-lg shadow-md p-4">
            <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-semibold text-[#003670] mb-2">{dish.name}</h2>
            <p className="text-[#003670] opacity-75 mb-2">{dish.description}</p>
            <p className="text-[#003670] font-bold mb-4">{dish.price} €</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditDish(dish.id)}
                className="bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white p-2 rounded-full transition-colors duration-200"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDeleteDish(dish.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dishes;