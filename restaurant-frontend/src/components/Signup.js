import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8081/api/auth/signup', { name, email, password, role: 'USER' });
      alert('Inscription réussie !');
      navigate('/login');
    } catch (error) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#003670] mb-6 text-center">Inscription</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A7C7E7]" size={18} />
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A7C7E7]" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A7C7E7]" size={18} />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-[#A7C7E7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#003670]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              'Inscription en cours...'
            ) : (
              <>
                <UserPlus className="mr-2" size={18} />
                S'inscrire
              </>
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-[#003670] font-medium hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;