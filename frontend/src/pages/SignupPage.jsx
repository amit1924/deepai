import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      toast.success('Account created! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">AI</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Create your account to start chatting with friends!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Full Name
            </label>
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
          </div>

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
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isSigningUp && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSigningUp ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
