const Chat = require('../models/chat')

const getChats = async () => {
  return Chat.find(function (err, chats) {
    if (err) return err
    return chats
  })
}

const createChat = async (opponentId, playerId ) => {
  const chat = new Chat({
    users: [opponentId, playerId],
    messages: []
  })
  return await chat.save()
}

const updateChat = async (chatId, message) => {
  let chat = await Chat.findById(chatId)
  chat.messages.push(message)
  return await chat.save()
}

module.exports = {
  getChats,
  createChat,
  updateChat
}