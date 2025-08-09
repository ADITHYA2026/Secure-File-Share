import React from 'react';
import { motion } from 'framer-motion';
import './LinkResult.css';

const LinkResult = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="link-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Your Secure Link:</h3>
      <div className="link-container">
        <input 
          type="text" 
          readOnly 
          value={link} 
          className="link-input"
          onClick={(e) => e.target.select()}
        />
        <motion.button 
          onClick={copyToClipboard}
          className="copy-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </motion.button>
      </div>
      <p className="link-note">
        This link will expire after the time you set. Share it securely!
      </p>
    </motion.div>
  );
};

export default LinkResult;
