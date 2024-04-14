import React from "react";
import loginBg from "../assets/images/loginBg.png";
import logo from "../assets/images/logo.png";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <div className="relative min-h-screen flex justify-center items-center">
        <img src={loginBg} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute top-0 left-0 p-4 flex items-center z-10">
          <img src={logo} alt="Better Care Logo" className="w-12 h-12 mr-2"/>
          <h1 className="text-4xl font-bold text-white">Artistic Ally</h1>
        </div>
        <div className="flex justify-center items-center z-10">
          <div className="max-w-md bg-white bg-opacity-80 shadow-lg rounded-lg p-8 relative"> 
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2> 
            <form className="space-y-6"> 
              <div className="flex flex-col"> 
                <label htmlFor="username" className="text-gray-600 text-sm font-medium">Artist ID</label> 
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  required
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-gray-600 text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Password"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-center"> 
                <Link to="/" className="bg-blue-500 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-600">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
