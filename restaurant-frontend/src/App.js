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
import UserLayout from './components/user/UserLayout';
import UserDashboard from './components/user/UserDashboard';
import Profile from './components/user/Profile';
import UserOrders from './components/user/Orders';
import Cart from './components/user/Cart';
import RestaurantDetails from './components/user/RestaurantDetails';
import DishDetails from './components/user/DishDetails';

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
          <Route element={<Middleware allowedRoles={['USER']} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/orders" element={<UserOrders />} />
              <Route path="/user/cart" element={<Cart />} />
              <Route path="/user/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/user/dish/:id" element={<DishDetails />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;