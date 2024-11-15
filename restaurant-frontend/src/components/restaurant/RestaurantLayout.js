import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingBag, LogOut } from 'lucide-react';
import axios from 'axios';

function RestaurantLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8081/api/restaurant/info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRestaurantInfo(response.data);
                localStorage.setItem('restaurantInfo', JSON.stringify(response.data));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching restaurant info:', error);
                setError('Failed to fetch restaurant information. Please try again.');
                setLoading(false);
            }
        };

        const storedInfo = localStorage.getItem('restaurantInfo');
        if (storedInfo) {
            try {
                const parsedInfo = JSON.parse(storedInfo);
                setRestaurantInfo(parsedInfo);
                setLoading(false);
            } catch (error) {
                console.error('Error parsing stored restaurant info:', error);
                fetchRestaurantInfo();
            }
        } else {
            fetchRestaurantInfo();
        }
    }, [navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!restaurantInfo) {
        return <div className="flex justify-center items-center h-screen">No restaurant information available.</div>;
    }

    return (
        <div className="flex h-screen bg-[#F0F8FF]">
            <aside className="w-64 bg-[#003670] text-white p-6 flex flex-col">
                <Link to="/restaurant" className="flex items-center space-x-2 mb-8">
                    <h1 className="text-2xl font-bold">Mon Restaurant</h1>
                </Link>
                <nav className="space-y-4 flex-grow">
                    <Link
                        to="/restaurant/dishes"
                        className={`flex items-center space-x-2 p-2 rounded ${location.pathname.includes('/dishes') ? 'bg-[#A7C7E7] text-[#003670]' : 'hover:bg-[#A7C7E7] hover:text-[#003670]'}`}
                    >
                        <Coffee size={20} />
                        <span>Plats</span>
                    </Link>
                    <Link
                        to="/restaurant/orders"
                        className={`flex items-center space-x-2 p-2 rounded ${location.pathname.includes('/orders') ? 'bg-[#A7C7E7] text-[#003670]' : 'hover:bg-[#A7C7E7] hover:text-[#003670]'}`}
                    >
                        <ShoppingBag size={20} />
                        <span>Commandes</span>
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="py-3 px-6 text-[#A7C7E7] hover:bg-[#004d99] hover:text-white flex items-center justify-start mt-auto transition-colors duration-200"
                >
                    <LogOut className="mr-3" size={18} />
                    Déconnexion
                </button>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default RestaurantLayout;
