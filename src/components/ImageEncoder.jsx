import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

function ImageEncoder() {
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [secretMessage, setSecretMessage] = useState(""); // State for secret message
  const [encodedImage, setEncodedImage] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle secret message input
  const handleSecretMessageChange = (e) => {
    setSecretMessage(e.target.value);
  };

  // Encode the image and the secret message
  const encodeImage = () => {
    if (!image || !password || !secretMessage) {
      alert("Please provide an image, password, and a secret message");
      return;
    }

    // Encrypt the secret message with the password
    const encryptedMessage = CryptoJS.AES.encrypt(secretMessage, password).toString();

    // Combine image and encrypted message (you can also encode the image if you need it)
    const encodedContent = {
      image: image,
      secretMessage: encryptedMessage,
    };

    setEncodedImage(encodedContent);
  };

  // Handle downloading the encoded image and message
  const handleDownload = () => {
    if (!encodedImage) {
      alert("No encoded image to download");
      return;
    }

    // Create a downloadable JSON file containing the encoded image and secret message
    const blob = new Blob([JSON.stringify(encodedImage)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "encoded_image.json";
    link.click();
  };

  return (
    
    <div className="image-encoder p-6 max-w-lg mx-auto bg-gray-200 rounded-lg shadow-md space-y-6"style={{ paddingTop: "120px" }}>
     <h2 className=" text-2xl font-bold-italic text-gray-800 text-center mb-4 "> Encode Image and Secret Message</h2>
      
      {/* Image file input */}
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
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"

        style={{
          width: "100%",
              cursor: "pointer",
              textAlign: "center",
              color: "#333",
              outline: "none",
        }}
      /></div>

{/* Display the uploaded image */}
{image && (
        <div className="uploaded-image mb-4">
          <h3 className="text-lg font-semibold">Uploaded Image:</h3>
          <img src={image} alt="Uploaded" className="w-full max-w-xs rounded-lg shadow-md" />
        </div>
      )}


      {/* Password input */}
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        className="mb-4"
        style={{
          padding: "12px",
          width: "100%",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        }}
      />

      {/* Secret message input */}
      <textarea
        placeholder="Enter your secret message"
        value={secretMessage}
        onChange={handleSecretMessageChange}
        className="mb-4 p-2 w-full"
        style={{
          padding: "12px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          marginBottom: "16px",
        }}
      />

      {/* Button to trigger encoding */}
      <button
        onClick={encodeImage}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Encode Image & Message
      </button>

    {/* Display the encoded image */}
    
          

      {/* Button to download encoded content */}
      {encodedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Encoded Image Preview:</h3>
          <img src={encodedImage.image} alt="Encoded" className="w-full max-w-xs rounded-lg shadow-md " />
          <button

            onClick={handleDownload}
            className="bg-green-500 text-white p-2 rounded"
          >
            Download Encoded Image & Message
          </button>
        </div>
      )}
    </div>
    
  );
}

export default ImageEncoder;
