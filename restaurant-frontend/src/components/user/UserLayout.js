import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, ShoppingBag, ShoppingCart, LogOut, Utensils } from 'lucide-react';

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F0F8FF]">
      <aside className="w-64 bg-[#003670] text-white shadow-lg flex flex-col">
        <div className="p-5">
          <Utensils className="text-[#A7C7E7] mr-4" size={48} />
        </div>
        <nav className="flex-grow mt-6">
          <Link 
            to="/user" 
            className={`flex items-center py-3 px-6 text-sm font-medium rounded-r-full transition-colors duration-200 ${
              location.pathname === '/user' 
                ? 'bg-[#A7C7E7] text-[#003670]' 
                : 'text-[#A7C7E7] hover:bg-[#004d99] hover:text-white'
            }`}
          >
            <Home className="mr-3" size={18} />
            Restaurants
          </Link>
          <Link 
            to="/user/profile" 
            className={`flex items-center py-3 px-6 text-sm font-medium rounded-r-full transition-colors duration-200 ${
              location.pathname === '/user/profile' 
                ? 'bg-[#A7C7E7] text-[#003670]' 
                : 'text-[#A7C7E7] hover:bg-[#004d99] hover:text-white'
            }`}
          >
            <User className="mr-3" size={18} />
            Profil
          </Link>
          <Link 
            to="/user/orders" 
            className={`flex items-center py-3 px-6 text-sm font-medium rounded-r-full transition-colors duration-200 ${
              location.pathname === '/user/orders' 
                ? 'bg-[#A7C7E7] text-[#003670]' 
                : 'text-[#A7C7E7] hover:bg-[#004d99] hover:text-white'
            }`}
          >
            <ShoppingBag className="mr-3" size={18} />
            Commandes
          </Link>
          <Link 
            to="/user/cart" 
            className={`flex items-center py-3 px-6 text-sm font-medium rounded-r-full transition-colors duration-200 ${
              location.pathname === '/user/cart' 
                ? 'bg-[#A7C7E7] text-[#003670]' 
                : 'text-[#A7C7E7] hover:bg-[#004d99] hover:text-white'
            }`}
          >
            <ShoppingCart className="mr-3" size={18} />
            Panier
          </Link>
        </nav>
        <button 
          onClick={handleLogout} 
          className="w-full py-3 px-6 text-[#A7C7E7] hover:bg-[#004d99] hover:text-white flex items-center justify-start mt-auto mb-8 transition-colors duration-200"
        >
          <LogOut className="mr-3" size={18} />
          Déconnexion
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserLayout;