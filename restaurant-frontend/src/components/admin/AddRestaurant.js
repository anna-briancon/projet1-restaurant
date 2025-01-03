import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Plus } from 'lucide-react';

function AddRestaurant() {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', email: '', password: '', address: '', postalCode: '', city: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/restaurateurs', newRestaurant, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Restaurant ajouté avec succès');
      navigate('/admin');
    } catch (error) {
      alert('Erreur lors de l\'ajout du restaurant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003670]">Ajouter un nouveau restaurateur</h2>
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={18} />
            Retour
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="name">
              Nom du restaurant
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="name"
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="email"
              type="email"
              name="email"
              value={newRestaurant.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="password"
              type="password"
              name="password"
              value={newRestaurant.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="address">
              Adresse
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="address"
              type="text"
              name="address"
              value={newRestaurant.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="postalCode">
              Code postal
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="postalCode"
              type="text"
              name="postalCode"
              value={newRestaurant.postalCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-[#003670] text-sm font-medium mb-2" htmlFor="city">
              Ville
            </label>
            <input
              className="w-full px-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
              id="city"
              type="text"
              name="city"
              value={newRestaurant.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              className={`bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              <Plus className="mr-2" size={18} />
              {loading ? 'Ajout en cours...' : 'Ajouter le restaurant'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddRestaurant;