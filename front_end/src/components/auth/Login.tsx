import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      window.location.href = '/app';
    } catch (error) {
      setError('Identifiant ou mot de passe incorrect');
    }
  };

  const signUpPage = async (event: React.FormEvent) => {
    window.location.href = '/signup';
  };

  return (
    <div>
      <div className='header'>
        <Link to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.svg.png`} alt="Favicon" className='favicon'/>
        </Link>
        <h2>UFC Que Choisir</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
         
          <label>Nom d'utilisateur </label>
          <br/>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /> 
          <br/>
          <br/>

          <label>Mot de passe </label>
          <br/>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <br/>

        {error && <p className='error'>{error}</p>}
        <button type="submit">Se connecter</button>
        <br/>
        <br/>
        <hr/>  
        <br/>
      </form>
      <button type="button" onClick={signUpPage}>Créer un compte</button>
    </div>
  );
};

export default Login;
