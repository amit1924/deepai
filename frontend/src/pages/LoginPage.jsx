import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Sign in to continue chatting with your friends!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-400 mt-4 text-sm">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
