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
  console.log(chat)
  await chat.save()
  return chat
}

const updateChat = async (chatId, message) => {
  let chat = Chat.findById(chatId)
  chat.messages.append(message)
  console.log('updated chat', chat)
  await chat.save()
  return chat
}

module.exports = {
  getChats,
  createChat,
  updateChat
}