import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', email: '', password: '', address: '', postalCode: '', city: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/restaurateurs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleInputChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/restaurateurs', newRestaurant, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Restaurant ajouté avec succès');
      setNewRestaurant({ name: '', email: '', password: '', address: '', postalCode: '', city: '' });
      fetchRestaurants();
    } catch (error) {
      alert('Erreur lors de l\'ajout du restaurant');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', borderRight: '1px solid black', height: '100vh', padding: '20px' }}>
        <h3>Restaurateur</h3>
        <button onClick={handleLogout} style={{ marginTop: '20px' }}>Déconnexion</button>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Liste des restaurants</h2>
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>{restaurant.name} - {restaurant.city}</li>
          ))}
        </ul>
        <h2>Ajouter un restaurant</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nom" value={newRestaurant.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={newRestaurant.email} onChange={handleInputChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={newRestaurant.password} onChange={handleInputChange} required />
          <input type="text" name="address" placeholder="Adresse" value={newRestaurant.address} onChange={handleInputChange} required />
          <input type="text" name="postalCode" placeholder="Code postal" value={newRestaurant.postalCode} onChange={handleInputChange} required />
          <input type="text" name="city" placeholder="Ville" value={newRestaurant.city} onChange={handleInputChange} required />
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;