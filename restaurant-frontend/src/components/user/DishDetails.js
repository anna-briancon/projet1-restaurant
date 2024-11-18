import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react';

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

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
        const dishData = response.data;
        if (dishData.photo && dishData.photo.data) {
          dishData.photoBase64 = `data:image/jpeg;base64,${arrayBufferToBase64(dishData.photo.data)}`;
        }
        setDish(dishData);
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
      await axios.post('http://localhost:8081/api/user/cart',
        { dishId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddToCartSuccess(true);
      setAddToCartError(null);
      setTimeout(() => setAddToCartSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setAddToCartError('Erreur lors de l\'ajout au panier');
      setAddToCartSuccess(false);
      setTimeout(() => setAddToCartError(null), 3000);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#003670]"></div>
  </div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#003670] hover:text-[#002550] transition-colors"
        >
          <ChevronLeft className="mr-1" size={20} />
          Retour au restaurant
        </button>
        <Link to="/user/cart" className="flex items-center px-4 py-2 bg-[#003670] text-white rounded-full hover:bg-[#002550] transition-colors shadow-md">
          <ShoppingCart className="mr-2" size={20} />
          Panier
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {dish.photoBase64 && (
              <img src={dish.photoBase64} alt={dish.name} className="h-96 w-full object-cover md:w-96" />
            )}
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#003670] mb-2">{dish.name}</h1>
            <p className="text-2xl font-semibold text-[#003670] mb-4">{dish.price} €</p>
            <p className="text-gray-600 mb-6">{dish.description}</p>
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-4 text-lg font-medium text-[#003670]">Quantité:</label>
              <div className="flex items-center border border-[#003670] rounded-full">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-[#003670] hover:bg-[#003670] hover:text-white transition-colors rounded-l-full"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-12 text-center border-none focus:ring-0"
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-[#003670] hover:bg-[#003670] hover:text-white transition-colors rounded-r-full"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 bg-[#003670] text-white text-lg font-semibold rounded-full hover:bg-[#002550] transition-colors shadow-md"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      {addToCartSuccess && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-full text-center animate-fade-in-out">
          Plat ajouté au panier avec succès!
        </div>
      )}
      {addToCartError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-full text-center animate-fade-in-out">
          {addToCartError}
        </div>
      )}
    </div>
  );
}

export default DishDetails;