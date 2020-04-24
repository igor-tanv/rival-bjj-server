const chatData = require('../../data/ChatData')

const getChat = async (opponentId, playerId) => {
  let chats = await chatData.getChats()
  if (chats.length) {
    return chats.filter((chat) => {
      if (chat.users.includes(opponentId) && chat.users.includes(playerId)) {
        return chat
      }
    })
  } else {
    return chats
  }
}

module.exports = {
  getChat
}