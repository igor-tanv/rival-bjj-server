const chatData = require('../../data/ChatData')
const getPlayers = require('../player/getPlayers')

const createChat = async (opponentId, playerId) => {
  let opponent = await getPlayers.getPlayer(opponentId)
  let chat = await chatData.createChat(opponentId, playerId)
  chat.opponent = opponent
  return chat 
}

module.exports = {
  createChat
}