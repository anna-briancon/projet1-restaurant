import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8081/api/user/profile', user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-[#003670] mb-6">Mon Profil</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg bg-white shadow-lg rounded-3xl p-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            id="name"
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#003670] text-white rounded-full hover:bg-[#002550] transition-colors"
        >
          Mettre à jour le profil
        </button>
      </form>
      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-full text-center animate-fade-in-out">
          Profil mis à jour avec succès !
        </div>
      )}
    </div>
  );
}

export default Profile;