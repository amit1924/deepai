import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../lib/env.js';

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];
    if (!token) {
      return next(new Error('Authentication failed -No token provided'));
    }
    //verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return next(new Error('Authentication failed - Invalid token'));
    }
    //attach user information to the socket
    socket.user = user;
    socket.userId = user._id.toString();
    console.log(`Socket authenticated: ${socket.userId} - ${user.fullName}...`);
    next();
  } catch (error) {
    console.error('Error in socketAuthMiddleware:', error);
    next(new Error('Authentication failed - Invalid token'));
  }
};
