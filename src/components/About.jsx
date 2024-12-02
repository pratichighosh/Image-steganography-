import React from 'react';
import aboutImage from '../assets/about1.jpg'; // Corrected image import

function About() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="flex flex-col space-y-4 w-full py-8 px-6">
        {/* Box 1 - Introduction */}
        <div className="bg-white p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">About Image Steganography</h2>
          <p className="text-gray-700 mb-4 flex-grow">
            Image steganography is a technique used to hide secret information within an image file, making the data invisible
            to the human eye. It allows for secure and discreet communication by embedding a message or data in an image without
            altering its appearance.
          </p>
          <img
            src={aboutImage}
            alt="An example of image steganography in action"
            className="w-full h-full object-cover rounded-md shadow-md"
            
          />
        </div>

        {/* Box 2 - How It Works */}
        <div className="bg-white p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">How It Works</h2>
          <p className="text-gray-700 flex-grow">
            The hidden data is usually embedded within the pixels of the image, modifying the least significant bits (LSBs)
            of each pixel so that the image looks unchanged to the naked eye. Special decoding techniques and algorithms are
            required to retrieve this hidden information.
          </p>
        </div>

        {/* Box 3 - Applications */}
        <div className="bg-white p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Applications</h2>
          <ul className="list-disc pl-5 text-gray-700 flex-grow space-y-2">
            <li>Confidential communication and secure file transfer</li>
            <li>Watermarking for copyright protection</li>
            <li>Concealing sensitive information in digital media</li>
            <li>Digital forensics and law enforcement</li>
          </ul>
        </div>

        {/* Box 4 - Why Use It */}
        <div className="bg-white p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Why Use It?</h2>
          <p className="text-gray-700 flex-grow">
            By hiding information in images, steganography offers a covert way to communicate without drawing attention.
            Unlike encryption, which protects data by making it unreadable, steganography hides the existence of data altogether.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
