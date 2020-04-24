const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
}, {
  timestamps: true
})

const userSchema = new mongoose.Schema({
  idOne: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Player'
  },
  idTwo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Player'
  },
})

const chatSchema = new mongoose.Schema({
  users: [],
  messages: [messageSchema]
},
  {
    timestamps: true
  })

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat