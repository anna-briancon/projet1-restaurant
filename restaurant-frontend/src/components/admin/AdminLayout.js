import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react'; 

function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#F0F8FF]">
            <aside className="w-64 bg-[#003670] text-white shadow-lg flex flex-col">
                <div className="p-5">
                    <h1 className="text-2xl font-bold text-[#A7C7E7]">Admin</h1>
                </div>
                <nav className="flex-grow mt-6">
                    <Link 
                        to="/admin" 
                        className={`flex items-center py-3 px-6 text-sm font-medium rounded-r-full transition-colors duration-200 ${
                            location.pathname === '/admin' 
                                ? 'bg-[#A7C7E7] text-[#003670]' 
                                : 'text-[#A7C7E7] hover:bg-[#004d99] hover:text-white'
                        }`}
                    >
                        <LayoutDashboard className="mr-3" size={18} />
                        Restaurateurs
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
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;