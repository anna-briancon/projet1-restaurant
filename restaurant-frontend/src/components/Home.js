import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, Utensils } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F8FF]">
      <div className="text-center mb-10">
        <Utensils className="inline-block text-[#003670] mb-4" size={48} />
        <h1 className="text-4xl font-bold text-[#003670] mb-2">Accueil</h1>
      </div>
      <div className="space-x-4">
        <Link to="/signup">
          <button className="bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-200">
            <UserPlus className="mr-2" size={20} />
            Inscription
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-[#003670] hover:bg-[#A7C7E7] text-white hover:text-[#003670] font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-200">
            <LogIn className="mr-2" size={20} />
            Connexion
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;