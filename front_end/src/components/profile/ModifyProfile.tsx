import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/auth/AuthContext';

export default function ModifyProfile() {
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 

  useEffect(() => {
    if (auth.user) {
      setUsername(auth.user.name);
    }
  }, [auth.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) { 
      return;
    }

    if (!username.trim()) {
        alert("Veuillez remplir les champs");
        return;
    }

    const updateData: any = { username };

    if (password) {
      if (password.length < 8) {
         alert('Le mot de passe doit contenir au moins 8 caractères.');
         return;
      }
      updateData.password = password;
    }

    try {
      const response = await axios.put(
        'http://localhost:3000/profile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Profil mis à jour avec succès.');
      } else {
        alert('Erreur lors de la mise à jour du profil.');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div>
      <h2>Modifier le profil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form> 
    </div>
  );
}
