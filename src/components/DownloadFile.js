import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { getFileMeta } from '../graphql/queries';
import { useParams } from 'react-router-dom';

const DownloadFile = () => {
  const { id } = useParams();
  const [fileMeta, setFileMeta] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();

  useEffect(() => {
    const fetchFileMeta = async () => {
      try {
        const res = await client.graphql({
          query: getFileMeta,
          variables: { id }
        });
        const fileData = res.data.getFileMeta;
        if (!fileData) {
          setStatus('not_found');
          return;
        }

        const now = new Date();
        const expiry = new Date(fileData.expiry);
        if (now > expiry) {
          setStatus('expired');
        } else {
          setFileMeta(fileData);
        }
      } catch (err) {
        console.error('Metadata fetch failed:', err);
        setStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileMeta();
  }, [id, client]);

  const handleDownload = async () => {
    if (fileMeta.password && fileMeta.password !== enteredPassword) {
      setStatus('wrong_password');
      return;
    }

    try {
      setStatus('downloading');
      
      // Get signed URL for each file
      const downloadPromises = fileMeta.fileKey.split(',').map(async (key) => {
        const signedURL = await getUrl({
          key: key.trim(),
          options: { expiresIn: 300 }
        });

        // Fetch the file as a blob
        const response = await fetch(signedURL.url);
        const blob = await response.blob();

        // Create temporary download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = key.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      await Promise.all(downloadPromises);
      setStatus('success');
    } catch (err) {
      console.error('Download failed:', err);
      setStatus('error');
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="download-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-spinner"></div>
        <p>Checking your file...</p>
      </motion.div>
    );
  }

  if (status === 'not_found') {
    return (
      <motion.div 
        className="download-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-icon">❌</div>
        <h3>File Not Found</h3>
        <p>The file you're looking for doesn't exist or may have been deleted.</p>
      </motion.div>
    );
  }

  if (status === 'expired') {
    return (
      <motion.div 
        className="download-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-icon">⏳</div>
        <h3>Link Expired</h3>
        <p>This download link has expired. Please request a new one.</p>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div 
        className="download-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-icon">⚠️</div>
        <h3>Error Occurred</h3>
        <p>Something went wrong. Please try again later.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="download-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="download-header">
        <h2>Download Your Files</h2>
        <p className="file-info">
          <span className="file-count">
            {fileMeta.fileKey.split(',').length} file(s)
          </span>
          {fileMeta.expiry && (
            <span className="expiry-info">
              Expires: {new Date(fileMeta.expiry).toLocaleString()}
            </span>
          )}
        </p>
      </div>

      {fileMeta?.password && (
        <div className="password-prompt">
          <h3>Password Required</h3>
          <p>This file is protected with a password</p>
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="password-input"
          />
          {status === 'wrong_password' && (
            <p className="error-message">❌ Incorrect password. Please try again.</p>
          )}
        </div>
      )}

      <motion.button
        onClick={handleDownload}
        className="download-button"
        disabled={status === 'downloading' || (fileMeta?.password && !enteredPassword)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {status === 'downloading' ? (
          <>
            <span className="download-spinner"></span>
            Preparing download...
          </>
        ) : (
          <>
            <span className="download-icon">⬇️</span>
            Download Now
          </>
        )}
      </motion.button>

      {status === 'success' && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="success-icon">✅</span>
          Download started! Check your downloads folder.
        </motion.div>
      )}
    </motion.div>
  );
};

export default DownloadFile;
