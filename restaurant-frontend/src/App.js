import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import AddRestaurant from './components/admin/AddRestaurant';
import Middleware from './components/Middleware';
import RestaurantLayout from './components/restaurant/RestaurantLayout';
import RestaurantDashboard from './components/restaurant/RestaurantDashboard';
import Dishes from './components/dish/Dishes';
import AddDish from './components/dish/AddDish';
import Orders from './components/restaurant/Orders';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Middleware allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-restaurant" element={<AddRestaurant />} />
          </Route>
          <Route element={<Middleware allowedRoles={['RESTAURANT']} />}>
            <Route path="/restaurant" element={<RestaurantLayout />}>
              <Route index element={<RestaurantDashboard />} />
              <Route path="dishes" element={<Dishes />} />
              <Route path="add-dish" element={<AddDish />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;