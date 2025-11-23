import { useState } from 'react';
import { encryptMessage } from '../utils/crypto';
import { Notification } from './Notification';
import { Upload, Lock, MessageSquare, Download, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

function Encoder() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encodedImage, setEncodedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const validateInputs = () => {
    if (!image) {
      showNotification('error', 'Please select an image first');
      return false;
    }
    if (!message.trim()) {
      showNotification('error', 'Please enter a message to hide');
      return false;
    }
    if (password.length < 6) {
      showNotification('error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        showNotification('error', 'Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        showNotification('success', 'Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const encodeMessage = async () => {
  if (!validateInputs()) return;

  setLoading(true);
  try {
    // 1. Load uploaded image onto a canvas
    const img = new Image();
    img.src = image;               // "image" must hold the uploaded image URL
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    // 2. Encrypt message
    const encrypted = encryptMessage(message, password);

    // 3. Convert encrypted message to binary bits
    const binary = encrypted
      .split("")
      .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");

    // 4. Encode binary into LSB of image pixels
    for (let i = 0; i < binary.length; i++) {
      pixelData[i] = (pixelData[i] & 0xfe) | (binary[i] === "1" ? 1 : 0);
    }

    ctx.putImageData(imageData, 0, 0);

    // 5. Export final encoded PNG
    const encodedImageURL = canvas.toDataURL("image/png");

    setEncodedImage(encodedImageURL);
    showNotification("success", "Message encoded successfully!");

  } catch (error) {
    showNotification("error", error.message);
  } finally {
    setLoading(false);
  }
};

  const getPasswordStrength = () => {
    if (password.length >= 12) return { text: 'Very Strong', color: 'text-green-600', bg: 'bg-green-500', width: 'w-full' };
    if (password.length >= 8) return { text: 'Strong', color: 'text-green-600', bg: 'bg-green-500', width: 'w-3/4' };
    if (password.length >= 6) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-500', width: 'w-1/2' };
    return { text: 'Weak', color: 'text-red-600', bg: 'bg-red-500', width: 'w-1/4' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-8">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Image Upload Section */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Upload className="w-5 h-5 text-purple-600" />
          </div>
          <span>Upload Cover Image</span>
        </label>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block cursor-pointer"
          >
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              image 
                ? 'border-purple-300 bg-purple-50/50' 
                : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/30'
            }`}>
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Original" 
                    className="max-h-80 mx-auto rounded-xl shadow-lg" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Drop your image here or click to browse</p>
                  <p className="text-sm text-gray-500">PNG, JPG, or WebP • Maximum size: 5MB</p>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Message Input Section */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <span>Secret Message</span>
        </label>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none h-40 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
            placeholder="Type your confidential message here..."
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              message.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {message.length} characters
            </span>
          </div>
        </div>
      </div>

      {/* Password Input Section */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <span>Encryption Password</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
            placeholder="Enter a strong password (min. 6 characters)"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Password strength:</span>
              <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${strength.bg} ${strength.width} transition-all duration-500 rounded-full`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Encode Button */}
      <button
        onClick={encodeMessage}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transform hover:scale-[1.02]"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Encoding Message...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Encode & Encrypt Message</span>
          </>
        )}
      </button>

      {/* Encoded Image Result */}
      {encodedImage && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-full">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-green-800 text-xl">Encoded Image Ready!</h3>
          </div>
          <img
            src={encodedImage}
            alt="Encoded"
            className="max-h-80 mx-auto rounded-xl shadow-xl border-2 border-green-200"
          />
          <a
            href={encodedImage}
            download="stegano_encoded.png"
            className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            <span>Download Encoded Image</span>
          </a>
          <p className="text-sm text-green-700 text-center">
            Share this image securely. Only those with the password can decode it.
          </p>
        </div>
      )}
    </div>
  );
}

export default Encoder;