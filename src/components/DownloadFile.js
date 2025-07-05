import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { getFileMeta } from '../graphql/queries';
import { useParams } from 'react-router-dom';

const DownloadFile = () => {
  const { id } = useParams();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [status, setStatus] = useState('');
  const [filename, setFilename] = useState('');
  const client = generateClient();

  const handleDownload = async () => {
    try {
      const res = await client.graphql({
        query: getFileMeta,
        variables: { id }
      });
      const fileData = res.data.getFileMeta;

      const now = new Date();
      const expiry = new Date(fileData.expiry);

      if (now > expiry) {
        setStatus('expired');
        return;
      }

      if (fileData.password && fileData.password !== enteredPassword) {
        setStatus('wrong_password');
        return;
      }

      const signedURL = await getUrl({
        key: fileData.fileKey,
        options: {
          expiresIn: 300 // 5 minutes
        }
      });
      
      setFilename(fileData.filename);
      window.open(signedURL.url, "_blank");
      setStatus('success');
    } catch (err) {
      console.error('Download failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="download-box">
      <h2>Download File</h2>
      <input
        type="password"
        placeholder="Enter password (if any)"
        value={enteredPassword}
        onChange={(e) => setEnteredPassword(e.target.value)}
      />
      <button onClick={handleDownload}>Download</button>

      {status === 'expired' && <p style={{ color: 'red' }}>❌ Link expired</p>}
      {status === 'wrong_password' && <p style={{ color: 'red' }}>❌ Wrong password</p>}
      {status === 'success' && <p style={{ color: 'green' }}>✅ Download started: {filename}</p>}
      {status === 'error' && <p style={{ color: 'red' }}>❌ Error occurred</p>}
    </div>
  );
};

export default DownloadFile;
