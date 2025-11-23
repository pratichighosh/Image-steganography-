import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { decryptMessage } from "../utils/crypto";
import { Upload, Lock, Eye, EyeOff, FileSearch } from "lucide-react";

function ImageDecoder() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

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

  const decodeMessage = () => {
    if (!selectedImage) return toast.error("Upload encoded image!");
    if (!password) return toast.error("Enter password!");

    setLoading(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;

      ctx.drawImage(selectedImage, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let bits = "";

      for (let i = 0; i < imageData.data.length; i += 4) {
        bits += imageData.data[i] & 1;

        if (bits.length % 8 === 0) {
          const byte = bits.slice(-8);
          if (byte === "00000000") break;
        }
      }

      let encrypted = "";
      for (let i = 0; i < bits.length; i += 8) {
        encrypted += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
      }

      encrypted = encrypted.replace(/\0/g, "");

      const decrypted = decryptMessage(encrypted, password);

      if (!decrypted) {
        toast.error("Wrong password!");
      } else {
        setDecodedMessage(decrypted);
        toast.success("Message decoded!");
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Image upload */}
      <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-xl text-center cursor-pointer">
        <input {...getInputProps()} />
        {selectedImage ? (
          <img src={selectedImage.src} className="max-h-80 mx-auto rounded-lg" />
        ) : (
          <Upload className="mx-auto w-10 h-10 text-blue-600" />
        )}
      </div>

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
        onClick={decodeMessage}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
      >
        {loading ? (
          <> Decoding... </>
        ) : (
          <>
            <FileSearch /> Decode Message
          </>
        )}
      </button>

      {decodedMessage && (
        <div className="p-4 bg-green-100 border rounded-xl">
          <p className="font-bold">Decoded Message:</p>
          <p>{decodedMessage}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default ImageDecoder;
