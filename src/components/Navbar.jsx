import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Navbar.css'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-white fixed w-full top-0 shadow-md h-20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
          <h2 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold border border-gray-300 rounded-md px-3 py-1 bg-white">
            Image Steganography
          </h2>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link
              to="/about"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/encoder"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200"
            >
              Image Encoder
            </Link>
          </li>
          <li>
            <Link
              to="/decoder"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200"
            >
              Image Decoder
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center text-gray-600 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-white border-t border-gray-300 flex flex-col items-center py-4">
          <li>
            <Link
              to="/about"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200 mb-2"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/encoder"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200 mb-2"
            >
               Encoder
            </Link>
          </li>
          <li>
            <Link
              to="/decoder"
              className="text-black text-lg hover:underline border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-300 transition duration-200"
            >
               Decoder
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
