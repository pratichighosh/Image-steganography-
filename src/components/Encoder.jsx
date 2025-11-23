import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { encryptMessage } from "../utils/crypto";
import { Upload, Lock, Eye, EyeOff, Download } from "lucide-react";

function ImageEncoder() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [encodedImage, setEncodedImage] = useState(null);

  const canvasRef = useRef(null); // REQUIRED

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => setSelectedImage(img);
        img.src = reader.result;
      };
      reader.readAsDataURL(files[0]);
    }
  });

  const encodeMessage = async () => {
    if (!selectedImage) return toast.error("Upload an image first!");
    if (!message) return toast.error("Enter a secret message!");
    if (!password) return toast.error("Enter a password!");

    setLoading(true);

    try {
      const encrypted = encryptMessage(message, password);
      const binaryMessage =
        encrypted
          .split("")
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
          .join("") + "00000000"; // message terminator

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;

      ctx.drawImage(selectedImage, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < binaryMessage.length; i++) {
        imageData.data[i * 4] =
          (imageData.data[i * 4] & 254) | Number(binaryMessage[i]);
      }

      ctx.putImageData(imageData, 0, 0);

      const result = canvas.toDataURL("image/png");
      setEncodedImage(result);

      toast.success("Message encoded successfully!");
    } catch (error) {
      toast.error("Encoding failed!");
    }

    setLoading(false);
  };

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = encodedImage;
    a.download = "encoded-image.png";
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-xl text-center cursor-pointer">
        <input {...getInputProps()} />
        {selectedImage ? (
          <img src={selectedImage.src} className="max-h-80 mx-auto rounded-lg" />
        ) : (
          <Upload className="mx-auto w-10 h-10 text-blue-600" />
        )}
      </div>

      {/* Message */}
      <textarea
        className="w-full p-4 border rounded-xl"
        placeholder="Enter your secret message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full p-4 pr-12 border rounded-xl"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <button
        onClick={encodeMessage}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        {loading ? "Encoding..." : "Encode Message"}
      </button>

      {encodedImage && (
        <button
          onClick={downloadImage}
          className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Download /> Download Encoded Image
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default ImageEncoder;
