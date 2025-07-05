import React, { useState, useEffect } from 'react';
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
      // First get the signed URL with forced download headers
      const signedURL = await getUrl({
        key: fileMeta.fileKey,
        options: { 
          expiresIn: 300,
          download: true,
          // Explicitly set content disposition
          responseContentDisposition: `attachment; filename="${encodeURIComponent(fileMeta.filename)}"`
        }
      });

      // Create a hidden iframe to handle the download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = signedURL.url;
      document.body.appendChild(iframe);
      
      // Fallback method for stubborn browsers
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = signedURL.url;
        a.download = fileMeta.filename || 'download';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 1000);
      
      // Cleanup iframe after some time
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 5000);

      setStatus('success');
    } catch (err) {
      console.error('Download failed:', err);
      setStatus('error');
    }
  };

  if (isLoading) return <p>⏳ Loading...</p>;

  if (status === 'not_found') return <p>❌ File not found</p>;
  if (status === 'expired') return <p>❌ Link expired</p>;
  if (status === 'error') return <p>❌ An error occurred</p>;

  return (
    <div className="download-box">
      <h2>Download File</h2>
      {fileMeta?.password && (
        <input
          type="password"
          placeholder="Enter password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
        />
      )}
      <button onClick={handleDownload}>Download</button>

      {status === 'wrong_password' && <p style={{ color: 'red' }}>❌ Wrong password</p>}
      {status === 'success' && <p style={{ color: 'green' }}>✅ Download started: {fileMeta.filename}</p>}
    </div>
  );
};

export default DownloadFile;