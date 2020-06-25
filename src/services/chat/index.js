// import { createChat } from './createChat'
// import { getChat } from './getChat'
// import { updateChat } from './updateChat'

const createChat = require('./createChat')
const getChat = require('./getChat')
const updateChat = require('./updateChat')

module.exports = {
  createChat: createChat.createChat,
  getChat: getChat.getChat,
  updateChat: updateChat.updateChat
}