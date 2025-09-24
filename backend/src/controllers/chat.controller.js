// controllers/chat.controller.js
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const chat = new Chat({
      name: 'New Chat',
      user: req.user._id,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Rename a chat
export const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, user: req.user._id },
      { name },
      { new: true },
    );

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error renaming chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Ensure chat belongs to user
    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Delete all messages in this chat
    await Message.deleteMany({ chatId });

    // Delete the chat
    await Chat.deleteOne({ _id: chatId });

    res.status(200).json({ message: 'Chat deleted successfully', chatId });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
