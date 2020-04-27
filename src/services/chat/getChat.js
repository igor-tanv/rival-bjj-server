const chatData = require('../../data/ChatData')
const getPlayers = require('../player/getPlayers')


const getChat = async (opponentId, playerId) => {
  let chats = await chatData.getChats()
  if(!chats.length) return null
  let chat = chats.filter((chat) => (chat.users.includes(opponentId) && chat.users.includes(playerId)))
  if(!chat.length) return null
  chat = chat[0]
  let opponent = await getPlayers.getPlayer(opponentId)
  chat.messages = chat.messages.map((message) => {
    if (message.from == opponentId) { message.name = opponent.firstName + ' ' + opponent.lastName }
    else { message.name = 'You' }
    return message
  })
  chat.opponent = opponent
  return chat
}

module.exports = {
  getChat
}