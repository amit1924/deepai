// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // dynamic name (first user prompt)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
