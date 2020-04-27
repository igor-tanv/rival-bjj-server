const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
}, {
  timestamps: true
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