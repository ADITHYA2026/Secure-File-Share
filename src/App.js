import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import UploadForm from './components/UploadForm';
import LinkResult from './components/LinkResult';
import DownloadFile from './components/DownloadFile';

function App() {
  const [link, setLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <Router basename="/">
      <div className="app-container">
        <div className="header">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span role="img" aria-label="lock">🔒</span>
            SecureShare
          </motion.h1>
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Share files securely with end-to-end encryption
          </motion.p>
        </div>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <UploadForm 
                  setLink={setLink} 
                  setIsUploading={setIsUploading}
                  setUploadProgress={setUploadProgress}
                />
                <AnimatePresence>
                  {isUploading && (
                    <motion.div 
                      className="upload-progress"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="spinner"></div>
                      <p className="progress-text">
                        {uploadProgress > 0 ? 
                          `Uploading... ${uploadProgress}%` : 
                          "Preparing your files..."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
