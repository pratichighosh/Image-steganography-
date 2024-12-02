import React, { useState } from 'react';

function ImageSteganography() {
  const [message, setMessage] = useState('');

  return (
    <div className="steganography-container">
      <h1>Image Steganography</h1>
      <input
        type="file"
        onChange={(e) => {/* handle file upload */}}
        className="file-input"
      />
      <button onClick={() => {/* perform steganography */}} className="btn">
        Encode Message
      </button>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message to hide"
      />
    </div>
  );
}

export default ImageSteganography;
