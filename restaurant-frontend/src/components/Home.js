import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenue sur la gestion de restaurant</h1>
      <Link to="/signup"><button>Inscription</button></Link>
      <Link to="/login"><button>Connexion</button></Link>
    </div>
  );
}

export default Home;