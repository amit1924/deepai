import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  // ✅ Check Auth Status
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ authUser: null });
      console.error('Error checking auth:', error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      // Don't set authUser here!
      toast.success(
        response?.data?.message || 'Signup successful! 🎉 Please login.',
      );
      return true; // indicate success
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Signup failed. Please try again.',
      );
      return false; // indicate failure
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Login
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      set({ authUser: response.data });
      toast.success(
        response?.data?.message || 'Login successful! 🎉 Welcome back.',
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Logout
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const response = await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success(response?.data?.message || 'Logout successfully! 👋');
    } catch (error) {
      toast.error('Logout failed. Please try again.', error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (formData) => {
    try {
      const response = await axiosInstance.put(
        '/auth/update-profile',
        formData,
      );
      set({ authUser: response.data });
      toast.success(response.data.message || 'Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed.');
    }
  },
}));
