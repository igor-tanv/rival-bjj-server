const ChatData = require('../../data/ChatData')
const PlayerService = require('../player/index')

const updateChat = async (chatId, message) => {
  let chat = await ChatData.updateChat(chatId, message)
  chat.opponent = await PlayerService.getPlayer(chat.users.filter(id => id != message.from)[0])
  chat.messages = chat.messages.map((message) => {
    if (message.from == chat.opponent.id) { message.name = chat.opponent.firstName + ' ' + chat.opponent.lastName }
    else { message.name = 'You' }
    return message
  })
  return chat
}

module.exports = {
  updateChat
}