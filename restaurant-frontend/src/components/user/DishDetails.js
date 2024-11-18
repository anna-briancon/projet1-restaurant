import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

function DishDetails() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToCartError, setAddToCartError] = useState(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8081/api/user/cart',
        { dishId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddToCartSuccess(true);
      setAddToCartError(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setAddToCartError('Erreur lors de l\'ajout au panier');
      setAddToCartSuccess(false);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#003670] hover:underline"
        >
          &larr; Retour au restaurant
        </button>
        <Link to="/user/cart" className="flex items-center px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#003670] mb-2">{dish.name}</h1>
          <p className="text-gray-600 mb-4">{dish.description}</p>
          <p className="font-bold text-xl text-[#003670] mb-4">{dish.price} €</p>
          {dish.photo && (
            <img src={dish.photo} alt={dish.name} className="w-full h-64 object-cover rounded-md mb-4" />
          )}
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2">Quantité:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="border rounded px-2 py-1 w-16"
              min="1"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
      {addToCartSuccess && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Plat ajouté au panier avec succès!
        </div>
      )}
      {addToCartError && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {addToCartError}
        </div>
      )}
    </div>
  );
}

export default DishDetails;