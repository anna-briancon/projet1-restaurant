import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddDish() {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            await axios.post('http://localhost:8081/api/dishes', formData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/restaurant/dishes');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du plat', error);
            setError("Impossible d'ajouter le plat. L'image est trop volumineuse.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#003670] mb-6">Ajouter un nouveau plat</h2>
            {error && (
                <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#003670]">Nom du plat</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-[#A7C7E7] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
                    />
                </div>
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-[#003670]">Photo</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="mt-1 block w-full border border-[#A7C7E7] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-[#003670]">Prix (€)</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full border border-[#A7C7E7] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#003670]">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full border border-[#A7C7E7] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003670] focus:border-[#003670]"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#A7C7E7] hover:bg-[#003670] text-[#003670] hover:text-white font-medium py-2 px-4 rounded-full transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Ajout en cours...' : 'Ajouter le plat'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDish;