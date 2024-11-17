import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/user/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement du panier');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      await axios.post('http://localhost:8081/api/user/orders', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(true);
      setCart([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la création de la commande');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003670] mb-6">Mon Panier</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold text-[#003670]">{item.dish.name}</h2>
              <p className="text-gray-600">Prix: {item.dish.price} €</p>
              <p className="text-gray-600">Quantité: {item.quantity}</p>
            </div>
          ))}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-xl font-bold text-[#003670]">
              Total: {cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)} €
            </p>
          </div>
          <button 
            onClick={handleCheckout}
            className="mt-4 w-full px-4 py-2 bg-[#003670] text-white rounded-md hover:bg-[#002550] transition-colors"
          >
            Payer
          </button>
        </>
      )}
      {success && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Commande créée avec succès!
        </div>
      )}
    </div>
  );
}

export default Cart;