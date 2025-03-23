import React from 'react';
import { MdPhone, MdLock } from "react-icons/md";

function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="min-h-[500px] flex flex-col justify-center p-8 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Login</h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Phone Number Field */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a href="#" className="text-sm text-green-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          LOGIN
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-10 text-sm text-center text-gray-600">
        If you don't have an account,{' '}
        <a href="#" className="font-medium text-green-600 hover:underline">
          Register here
        </a>
      </div>
      <div className="mt-4 text-sm text-center text-gray-600">
        <a href="#" className="font-medium text-green-600 hover:underline">
          Need help?
        </a>
      </div>
    </div>
  );
}

export default LoginForm;
