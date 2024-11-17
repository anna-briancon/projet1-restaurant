import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DishDetails() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/dishes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDish(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement du plat');
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:8081/api/user/cart', { dishId: id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de l\'ajout au panier');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#003670] mb-2">{dish.name}</h1>
          <p className="text-gray-600 mb-4">{dish.description}</p>
          <p className="font-bold text-xl text-[#003670] mb-4">{dish.price} €</p>
          {dish.photo && (
            <img src={dish.photo} alt={dish.name} className="w-full h-64 object-cover rounded-md mb-4" />
          )}
          <button 
            onClick={handleAddToCart}
            className="w-full px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
      {success && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Plat ajouté au panier avec succès!
        </div>
      )}
    </div>
  );
}

export default DishDetails;