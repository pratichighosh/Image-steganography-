import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { decryptMessage } from '../utils/crypto';
import { Upload, Lock, FileSearch, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

function ImageDecoder() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [decryptionPassword, setDecryptionPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set up a base64 image directly for testing purposes
    const base64Image = "data:image/png;base64,...."; // Replace with your actual base64 image string
    const img = new Image();
    img.onload = () => setSelectedImage(img);
    img.src = base64Image;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => setSelectedImage(img);
        img.src = reader.result;
      };

      reader.readAsDataURL(file);
    }
  });

  const base64ToString = (str) => {
    return decodeURIComponent(escape(atob(str)));
  };

  const decodeMessage = () => {
    if (!selectedImage) {
      toast.error('Please upload an image');
      return;
    }

    if (!decryptionPassword) {
      toast.error('Please enter the decryption password');
      return;
    }

    setIsDecoding(true);

    // Simulate decoding delay for better UX
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;

      ctx.drawImage(selectedImage, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binaryMessage = '';
      let fullMessage = '';

      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1);

        if (binaryMessage.length % 8 === 0) {
          const char = String.fromCharCode(parseInt(binaryMessage.slice(-8), 2));
          fullMessage += char;

          if (char === '\0') break;
        }
      }

      try {
        const encodedMessage = fullMessage.replace(/\0/g, '');
        const encryptedData = JSON.parse(base64ToString(encodedMessage));

        const decryptedMessage = decryptMessage(encryptedData, decryptionPassword);

        if (decryptedMessage) {
          setDecodedMessage(decryptedMessage);
          toast.success('Message decoded successfully!');
        } else {
          toast.error('Decryption failed. Incorrect password?');
        }
      } catch (error) {
        toast.error('Failed to decode message. Check the image and password.');
      } finally {
        setIsDecoding(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <span>Upload Encoded Image</span>
        </label>
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : selectedImage
              ? 'border-blue-300 bg-blue-50/50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
        >
          <input {...getInputProps()} />
          {selectedImage ? (
            <div className="relative group">
              <img
                src={selectedImage.src}
                alt="Selected"
                className="max-h-80 mx-auto rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center">
                <FileSearch className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-700 font-medium mb-2">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an encoded image'}
              </p>
              <p className="text-sm text-gray-500">or click to select from your files</p>
            </div>
          )}
        </div>
      </div>

      {/* Password Input Section */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <span>Decryption Password</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter the decryption password"
            value={decryptionPassword}
            onChange={(e) => setDecryptionPassword(e.target.value)}
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && decodeMessage()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Use the same password that was used to encode the message
        </p>
      </div>

      {/* Decode Button */}
      <button
        onClick={decodeMessage}
        disabled={isDecoding}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:from-blue-400 disabled:to-cyan-400 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-[1.02]"
      >
        {isDecoding ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Decoding Message...</span>
          </>
        ) : (
          <>
            <FileSearch className="w-5 h-5" />
            <span>Decode & Decrypt Message</span>
          </>
        )}
      </button>

      {/* Decoded Message Display */}
      {decodedMessage && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-green-800 text-xl">Message Decoded Successfully!</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <p className="text-sm text-green-700 font-medium mb-3">Secret Message:</p>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap break-words">
              {decodedMessage}
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm text-green-700 bg-green-100 p-3 rounded-lg">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>This message was successfully decrypted using your password.</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default ImageDecoder;