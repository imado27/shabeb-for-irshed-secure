import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Decorative Top Background for page consistency */}
      <div className="h-64 bg-[#7e1d51] absolute top-0 left-0 w-full">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register;