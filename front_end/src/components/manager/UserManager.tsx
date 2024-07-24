import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  roles: {
    id: number;
    name: string;
  };
}

const UserManager: React.FC = () => {
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [tempEndTime, setTempEndTime] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setUsers(response.data.user);
    } catch (error) {
      alert('Error fetching users');
    }
  };

  const updateUserRole = async (userId: number, newRoleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const data: any = { roleId: parseInt(newRoleId) };
      if (newRoleId === "4" && tempEndDate && tempEndTime) {
        data.toBlockOn = `${tempEndDate}T${tempEndTime}`;
      }
      await axios.put(`http://localhost:3000/users/${userId}/role`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      fetchUsers(); 
    } catch (error) {
      alert('Error updating user role');
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      fetchUsers(); 
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleRoleChange = (userId: number, newRoleId: string) => {
    setSelectedUser(userId);
    if (newRoleId === "4") {
      setTempEndDate('');
      setTempEndTime('');
    } else {
      setTempEndDate('');
      setTempEndTime('');
    }
    updateUserRole(userId, newRoleId);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!auth.user) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.roles.name}</p>
              <select value={user.roles.id} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                <option value="1">Admin</option>
                <option value="2">User</option>
                <option value="3">Read-only</option>
                <option value="4">Temp-user</option>
              </select>
              {selectedUser === user.id && user.roles.id === 4 && (
                <div>
                  <label>Date de fin :</label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    value={tempEndTime}
                    onChange={(e) => setTempEndTime(e.target.value)}
                  />
                  <button onClick={() => updateUserRole(user.id, "4")}>Mettre à jour</button>
                </div>
              )}
              <br />
              <button onClick={() => deleteUser(user.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun utilisateur disponible.</p>
      )}
    </div>
  );
};

export default UserManager;
