import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import DocumentUploader from './DocumentUploader';
import DocumentViewer from './DocumentViewer';

interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const Vault: React.FC = () => {
  const auth = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('-');
  const [selectedYear, setSelectedYear] = useState<number | '-'>('-');
  const [showUploader, setShowUploader] = useState(false);
  const [documentCount, setDocumentCount] = useState<number>(0);

  useEffect(() => {
    fetchCategories();
    fetchDocumentCount(); 
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/documents/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setCategories(response.data);
    } catch (error) {
    }
  };

  const fetchYears = async (category: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/documents/years', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { category },
        withCredentials: true
      });
      setYears(response.data);
    } catch (error) {
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { category: selectedCategory, year: selectedYear },
        withCredentials: true
      });
      setDocuments(response.data.document);
      setDocumentCount(response.data.document.length);
    } catch (error) {
    }
  };

  const fetchDocumentCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/documents/count', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setDocumentCount(response.data.count);
    } catch (error) {
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedYear('-');
    if (category !== '-') {
      fetchYears(category);
    } else {
      setYears([]);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value === '-' ? '-' : parseInt(e.target.value, 10);
    setSelectedYear(year);
  };

  const handleSearch = () => {
    if (selectedCategory !== '-' && selectedYear !== '-') {
      fetchDocuments();
    }
  };

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };

  if (!auth.user) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div>
      <h2>Coffre-fort numérique</h2>
      {auth.user.role === 'admin' || auth.user.role ===  'user' && (
        <div>
          <p>Accès complet pour l'Admin.</p>
          <button onClick={handleToggleUploader}>
            {showUploader ? 'Masquer' : 'Ajouter un fichier'}
          </button>
          {showUploader && <DocumentUploader onUploadSuccess={fetchDocuments} />}
        </div>
      )}
      
      <div>
        <h3>Recherche de documents</h3>
        <div>
          <label>
            Catégorie:
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="-">-</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Année:
            <select value={selectedYear} onChange={handleYearChange} disabled={selectedCategory === '-'}>
              <option value="-">-</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>
        <button onClick={handleSearch} disabled={selectedCategory === '-' || selectedYear === '-'}>Rechercher</button>
      </div>

      <div>
        <h3>Documents</h3>
        <p>Nombre de documents: {documentCount}</p>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <DocumentViewer document={doc} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun document disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Vault;
