// routes/message.routes.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  saveMessage,
  getChatMessages,
} from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', protectRoute, saveMessage);
router.get('/:chatId', protectRoute, getChatMessages);

export default router;
