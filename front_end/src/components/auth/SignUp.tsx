import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', {
        username,
        email,
        password
      });
        localStorage.setItem('token', response.data.token);
        window.location.href = '/app';
        setSuccess('Account created successfully!');
        setError('');
    } catch (error) {
      setError('Error creating account');
      setSuccess('');
    }
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

        <label>Email </label>
        <br/>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {success && <p className='success'>{success}</p>}
        <button type="submit">Créer un compte</button>
      </form>
    </div>
  );
};

export default SignUp;
