import React, { useState } from 'react';

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
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [showPreview, setShowPreview] = useState(false);
  const fileExtension = document.fileUrl.split('.').pop()?.toLowerCase();
  const fileUrl = `http://localhost:3000/${document.fileUrl}`;

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

  return (
    <div>
      <h3>{document.title}</h3>
      <p>{document.description}</p>
      <a href={fileUrl} download={document.title} style={{ display: 'inline-block', padding: '10px 20px', margin: '10px 0', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>Télécharger le fichier</a>
      {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'].includes(fileExtension ?? '') && (
        <button onClick={() => setShowPreview(!showPreview)} style={{ display: 'block', marginTop: '10px' }}>
          {showPreview ? 'Masquer la prévisualisation' : 'Prévisualiser'}
        </button>
      )}
      {showPreview && renderDocument()}
    </div>
  );
};

export default DocumentViewer;
