const chatData = require('../../data/ChatData')

const createChat = async (opponentId, playerId) => {
  return await chatData.createChat(opponentId, playerId)
}

module.exports = {
  createChat
}