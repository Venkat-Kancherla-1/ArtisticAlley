import React from 'react';
import { Link } from 'react-router-dom';
import DanceImage from '../assets/images/Dance.jpg'; // Assuming Dance.jpg is the image in your assets

const Home = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0" style={{backgroundImage: `url(${DanceImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-10"></div>
      <div className="relative z-20 flex flex-col justify-center items-center h-screen text-white">
        <div className="absolute top-1/3 left-4 text-left">
          <p className="text-lg mb-4">"EveryThing you do is the reflection of You..."</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Join Us Now
          </button>
        </div>
        <nav className="absolute top-4 right-4">
          <ul className="flex">
            <li className="mx-2"><Link to="/home" className="text-white">Home</Link></li>
            <li className="mx-2"><Link to="/about" className="text-white">About</Link></li>
            <li className="mx-2"><Link to="/register" className="text-white">Register</Link></li>
            <li className="mx-2"><Link to="/login" className="text-white">Login</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
