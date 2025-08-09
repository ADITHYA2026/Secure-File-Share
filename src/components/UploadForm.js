import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { createFileMeta } from '../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';

const UploadForm = ({ setLink, setIsUploading, setUploadProgress }) => {
  const [files, setFiles] = useState([]);
  const [expiry, setExpiry] = useState('60');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const client = generateClient();

  const handleFileChange = (e) => {
    setError('');
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.some(file => file.size > 10 * 1024 * 1024)) {
      setError('File size should be less than 10MB');
      return;
    }
    setFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.some(file => file.size > 10 * 1024 * 1024)) {
      setError('File size should be less than 10MB');
      return;
    }
    setFiles(droppedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileId = uuidv4();
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(expiry));

      // Upload files to S3
      const uploadPromises = files.map(file => {
        const fileKey = `${fileId}/${file.name}`;
        return uploadData({
          key: fileKey,
          data: file,
          options: {
            contentType: file.type,
            progressCallback(progress) {
              setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
            }
          }
        }).result;
      });
      
      await Promise.all(uploadPromises);

      // Save metadata
      await client.graphql({
        query: createFileMeta,
        variables: {
          input: {
            id: fileId,
            filename: files.map(f => f.name).join(', '),
            fileKey: `${fileId}/`,
            expiry: expiryDate.toISOString(),
            password: password || null
          }
        }
      });

      setLink(`${window.location.origin}/download/${fileId}`);
      setFiles([]);
      setPassword('');
      setError('');
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="upload-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="file-upload" className="drop-zone-label">
          {files.length > 0 ? (
            <div className="files-preview">
              <h3>Selected Files:</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p>Drag & drop files here or click to browse</p>
              <p className="drop-zone-hint">Supports multiple files (max 10MB each)</p>
            </>
          )}
        </label>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiry">Expiry Time:</label>
          <select
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          >
            <option value="10">10 minutes</option>
            <option value="60">1 hour</option>
            <option value="1440">1 day</option>
            <option value="10080">1 week</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password (optional):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a password"
            minLength="4"
          />
        </div>
      </div>
      
      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      <motion.button 
        type="submit" 
        className="submit-button"
        disabled={files.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="button-text">Secure & Share</span>
        <span className="button-icon">🚀</span>
      </motion.button>
    </motion.form>
  );
};

export default UploadForm;
