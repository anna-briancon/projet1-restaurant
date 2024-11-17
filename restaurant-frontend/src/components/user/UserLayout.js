import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, ShoppingBag, ShoppingCart, LogOut } from 'lucide-react';

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-[#003670] text-white' : 'text-[#003670] hover:bg-[#A7C7E7]';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F0F8FF]">
      <nav className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <Link to="/user" className="block text-2xl font-bold text-[#003670] p-4">
            FoodApp
          </Link>
          <div className="flex flex-col space-y-2 mt-8">
            <Link
              to="/user"
              className={`flex items-center px-4 py-2 ${isActive('/restaurants')}`}
            >
              <Home className="mr-2 h-4 w-4" />
              Restaurants
            </Link>
            <Link
              to="/user/profile"
              className={`flex items-center px-4 py-2 ${isActive('/profile')}`}
            >
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
            <Link
              to="/user/orders"
              className={`flex items-center px-4 py-2 ${isActive('/orders')}`}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Commandes
            </Link>
            <Link
              to="/user/cart"
              className="flex items-center px-4 py-2 bg-[#003670] text-white hover:bg-[#002550] transition-colors"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Panier
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 mb-4 text-[#003670] hover:bg-[#A7C7E7] transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </button>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;