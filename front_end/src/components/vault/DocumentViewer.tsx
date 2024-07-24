import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';


interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentViewerProps {
  document: Document;
  onDelete: (documentId: number) => void;
  onUpdate: (documentId: number, updatedTitle: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onDelete, onUpdate }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);
  const fileExtension = document.fileUrl.split('.').pop()?.toLowerCase();
  const fileUrl = `http://localhost:3000/${document.fileUrl}`;
  const auth = useAuth();

  const renderDocument = () => {
    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <img src={fileUrl} alt={document.title} style={{ maxWidth: '100%' }} />;
      case 'pdf':
        return (
          <object data={fileUrl} type="application/pdf" width="100%" height="500px">
            <p>Votre navigateur ne supporte pas la pré-visualisation des PDFs. <a href={fileUrl} download={document.title} target="_blank" rel="noopener noreferrer">Télécharger PDF</a></p>
          </object>
        );
      case 'txt':
        return (
          <iframe src={fileUrl} title={document.title} width="100%" height="500px" />
        );
      default:
        return null;
    }
  };

  const handleDelete = () => {
    onDelete(document.id);
  };

  const handleUpdate = () => {
    onUpdate(document.id, newTitle);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleUpdate}>Enregistrer</button>
          <button onClick={() => setIsEditing(false)}>Annuler</button>
        </div>
      ) : (
        <>
          <h3>{document.title}</h3>
          <p>{document.description}</p>
          <a href={fileUrl} download={document.title} style={{ display: 'inline-block', padding: '10px 20px', margin: '10px 0', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>Télécharger le fichier</a>
          {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'].includes(fileExtension ?? '') && (
            <button onClick={() => setShowPreview(!showPreview)} style={{ display: 'block', marginTop: '10px' }}>
              {showPreview ? 'Masquer la prévisualisation' : 'Prévisualiser'}
            </button>
          )}
           
          {showPreview && renderDocument()}

            <button onClick={() => setIsEditing(true)} style={{ display: 'block', marginTop: '10px' }}>Modifier</button>
            <button onClick={handleDelete} style={{ display: 'block', marginTop: '10px' }}>Supprimer</button>
        </>
      )}
    </div>
  );
};

export default DocumentViewer;
