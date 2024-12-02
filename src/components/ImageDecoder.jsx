import React, { useState } from "react";
import CryptoJS from "crypto-js";

function ImageDecoder() {
  const [encodedImageData, setEncodedImageData] = useState(null);
  const [password, setPassword] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [image, setImage] = useState("");

  // Handle file upload for encoded image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          // Parse the JSON file content
          const data = JSON.parse(reader.result);
          setEncodedImageData(data);
          setImage(data.image); // Set image data (base64)
        } catch (error) {
          alert("Failed to decode the file. Please make sure it's a valid encoded image file.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Decode the secret message
  const decodeMessage = () => {
    if (!encodedImageData || !password) {
      alert("Please upload the encoded image and enter the password.");
      return;
    }

    try {
      // Decrypt the secret message using the password
      const bytes = CryptoJS.AES.decrypt(encodedImageData.secretMessage, password);
      const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedMessage) {
        setDecodedMessage(decryptedMessage);
      } else {
        alert("Incorrect password or unable to decrypt the message.");
      }
    } catch (error) {
      alert("Error in decrypting the message.");
    }
  };

  return (
    <div className="image-decoder p-6 max-w-lg mx-auto bg-gray-200 rounded-lg shadow-md space-y-6">
      <h2 className=" text-2xl font-bold-italic text-gray-800 text-center mb-4 ">Decode Image & Secret Message</h2>

      {/* File input to upload encoded image */}
      <div
          style={{
            backgroundColor: "#f7f7f7",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
        >
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-4 p-2 "
        style={{
          width: "100%",
              cursor: "pointer",
              textAlign: "center",
              color: "#333",
              outline: "none",
        }}
      /> </div>

      
      {/* Display the uploaded image */}
      {image && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Encoded Image:</h3>
          <img src={image} alt="Encoded" className="max-w-full" />
        </div>
      )}

{/* Password input */}
<input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        className="mb-4 p-2 "
        style={{
          padding: "12px",
          width: "100%",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        }}
      />

      {/* Decode button */}
      <button
        onClick={decodeMessage}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Decode Message
      </button>

      {/* Display the decoded message */}
      {decodedMessage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Decoded Secret Message:</h3>
          <p>{decodedMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ImageDecoder;