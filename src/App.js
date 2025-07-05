import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import LinkResult from './components/LinkResult';
import DownloadFile from './components/DownloadFile';

function App() {
  const [link, setLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <div className="header">
          <h1>🔐 Secure File Share</h1>
          <p className="subtitle">Password-protected file sharing</p>
        </div>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <UploadForm 
                  setLink={setLink} 
                  setIsUploading={setIsUploading} 
                />
                {isUploading && (
                  <div className="upload-progress">
                    <div className="spinner"></div>
                    <p>Uploading files...</p>
                  </div>
                )}
                {link && <LinkResult link={link} />}
              </>
            } 
          />
          <Route path="/download/:id" element={<DownloadFile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;