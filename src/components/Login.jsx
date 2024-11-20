import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from "../assets/login.png"; // Update with your login image path

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      console.log(values);
      // Here you would typically send values to your backend

      // Simulate success response
      setLoading(false);
    } catch (e) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full flex">
        {/* Left side: Form */}
        <div className="w-1/2 pr-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-700">Login to Your Account</h1>
            <p className="text-gray-500">Welcome back! Please login to continue.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              handleLogin({
                email: e.target.email.value,
                password: e.target.password.value,
              });
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <Link to="/register" className="text-indigo-500 hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </div>

        {/* Right side: Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={loginImage} alt="Login" className="w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
};

export default Login;
