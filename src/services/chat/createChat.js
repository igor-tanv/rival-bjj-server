const ChatData = require('../../data/ChatData')
const PlayerService = require('../player/index')

const createChat = async (opponentId, playerId) => {
  let opponent = await PlayerService.getPlayer(opponentId)
  let chat = await ChatData.createChat(opponentId, playerId)
  chat.opponent = opponent
  return chat 
}

module.exports = {
  createChat
}