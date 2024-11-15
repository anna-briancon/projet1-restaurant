import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import AddRestaurant from './components/admin/AddRestaurant';
import Middleware from './components/Middleware';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;