const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Player'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Player'
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;