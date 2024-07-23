import React, { useState } from 'react';
import axios from 'axios';

const CreateAG: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [agenda, setAgenda] = useState('');
  const [emails, setEmails] = useState<string[]>(['']);
  const [link, setLink] = useState(''); 
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const currentDate = new Date();
    const agDate = new Date(`${date}T${time}`);

    if (agDate < currentDate) {
      setError('La date et l\'heure de l\'AG ne peuvent pas être inférieures à la date actuelle.');
      return;
    }

    const agData = {
      title,
      date,
      time,
      agenda,
      emails,
      link
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/ags', agData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('AG créée avec succès.');
      } else {
        alert('Erreur lors de la création de l\'AG.');
      }
    } catch (error) {
      alert('Erreur lors de la création de l\'AG.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Titre de l'AG:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Heure:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Ordre du jour:
          <input 
            type={"text"}
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Emails des participants:
          {emails.map((email, index) => (
            <input
              key={index}
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              required
            />
          ))}
          <button type="button" onClick={handleAddEmail}>Ajouter un email</button>
        </label>
      </div>
      <div>
        <label>
          Lien de la réunion:
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Créer l'AG</button>
    </form>
  );
};

export default CreateAG;
