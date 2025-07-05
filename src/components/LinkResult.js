import React from 'react';
import './LinkResult.css';

const LinkResult = ({ link }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied!');
  };

  return (
    <div className="link-result">
      <h3>Shareable Link:</h3>
      <input type="text" readOnly value={link} />
      <button onClick={copyToClipboard}>Copy</button>
    </div>
  );
};

export default LinkResult;