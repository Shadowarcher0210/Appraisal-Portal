import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

// Function to check if the user is authenticated
// const isAuthenticated = () => {
//   const token = localStorage.getItem('token');
//   return token ? true : false;
// };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:3003/auth/login', { email, password });
      
      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard after successful login
      navigate('/home'); 
    } 
    catch (error) {
      // Display error message if login fails
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword'); // Redirect to the Forgot Password page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              id="email"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg py-2 w-full hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={handleForgotPassword} 
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
