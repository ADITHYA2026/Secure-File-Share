import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { createFileMeta } from '../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';

const UploadForm = ({ setLink, setIsUploading }) => {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState(10); // minutes
  const [password, setPassword] = useState('');
  const client = generateClient();

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const id = uuidv4();
    const filename = file.name;
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(expiry));

    try {
      setIsUploading(true);

      // Upload file to S3
      await uploadData({
        key: `${id}/${filename}`,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;

      // Save metadata
      await client.graphql({
        query: createFileMeta,
        variables: {
          input: {
            id,
            filename,
            fileKey: `${id}/${filename}`,
            expiry: expiryDate.toISOString(),
            password
          }
        }
      });

      setLink(`${window.location.origin}/download/${id}`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="number"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        placeholder="Expiry (minutes)"
        min="1"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Set Password (optional)"
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
