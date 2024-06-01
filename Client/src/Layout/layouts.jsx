import React from 'react';
import logo from "../assets/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex items-center mb-4">
        <img className="w-16 md:w-20" src={logo} alt="Logo" />
        <p className="ml-2 text-lg md:text-xl font-bold font-serif">Talk Hub</p>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
