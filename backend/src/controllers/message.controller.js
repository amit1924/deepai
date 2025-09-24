// controllers/message.controller.js
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

// Save new message in a chat
export const saveMessage = async (req, res) => {
  try {
    const { text, sender, chatId } = req.body;

    if (!text || !sender || !chatId) {
      return res
        .status(400)
        .json({ message: 'Text, sender, and chatId are required' });
    }

    // Ensure the chat belongs to the user
    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = new Message({
      text,
      sender,
      user: req.user._id,
      chatId,
    });

    await newMessage.save();

    // Update chat last updated time
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
