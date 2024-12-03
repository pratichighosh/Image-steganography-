import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import ImageEncoder from './components/ImageEncoder';
import ImageDecoder from './components/ImageDecoder';
//import steganographyImage from '../src/assets/steganography-blog.webp';
import './App.css';

function App() {
  return (
    <Router>
      
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
       style={{
        //backgroundImage: `url(${steganographyImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      >
     

        <Navbar />
        

        
        <Routes>
        <Route 
        path="/" 
        element={
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full  max-w-md">
          <About />
          </div>
        } />
        <Route 
        path="/about" 
        element={
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
          <About />
          </div>
        } />

          <Route
            path="/encoder"
            element={
              <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
                <ImageEncoder />
              </div>
            }
          />

          <Route
            path="/decoder"
            element={
              <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <ImageDecoder />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
