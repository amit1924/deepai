// routes/chat.routes.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createChat,
  deleteChat,
  getUserChats,
  renameChat,
} from '../controllers/chat.controller.js';

const router = express.Router();

// Create new chat
router.post('/', protectRoute, createChat);

// Get all chats of a user
router.get('/my', protectRoute, getUserChats);

// Rename a chat
router.put('/:chatId', protectRoute, renameChat);

// Delete chat
router.delete('/:chatId', protectRoute, deleteChat);

export default router;
