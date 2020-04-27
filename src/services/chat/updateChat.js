const chatData = require('../../data/ChatData')


const updateChat = async (chatId, message) => {
  return await chatData.updateChat(chatId, message)
  // move message sorting logic here 
}

module.exports = {
  updateChat
}