import { useState } from 'react';
import Encoder from './components/Encoder';
import Decoder from './components/Decoder';
import { Shield, Lock, Unlock } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('encode');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8">
      {/* Animated background overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yNCAzOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
      
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
              <Shield className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            SteganoVault
          </h1>
          <p className="text-purple-200 text-lg md:text-xl font-light">
            Secure Image Steganography Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-6 border-b border-purple-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                  activeTab === 'encode'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
                onClick={() => setActiveTab('encode')}
              >
                <Lock className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'encode' ? 'rotate-0' : 'group-hover:rotate-12'}`} />
                <span>Encode Message</span>
                {activeTab === 'encode' && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                )}
              </button>
              
              <button
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                  activeTab === 'decode'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
                onClick={() => setActiveTab('decode')}
              >
                <Unlock className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'decode' ? 'rotate-0' : 'group-hover:-rotate-12'}`} />
                <span>Decode Message</span>
                {activeTab === 'decode' && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-10">
            <div className="transition-all duration-300">
              {activeTab === 'encode' ? <Encoder /> : <Decoder />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>🔒 Your messages are encrypted end-to-end with AES-256</p>
        </div>
      </div>
    </div>
  );
}

export default App;