// import { getPlayers } from './getPlayers'
// import { getPlayer } from './getPlayer'
// import { registerPlayer } from './registerPlayer'
// import { deletePlayerById } from './deletePlayerById'
// import { updatePlayer } from './updatePlayer'

const getPlayers = require('./getPlayers')
const getPlayer = require('./getPlayer')
const registerPlayer = require('./registerPlayer')
const deletePlayerById = require('./deletePlayerById')
const updatePlayer = require('./updatePlayer')

module.exports = {
  getPlayers: getPlayers.getPlayers,
  getPlayer: getPlayer.getPlayer,
  registerPlayer: registerPlayer.registerPlayer,
  deletePlayerById: deletePlayerById.deletePlayerById,
  updatePlayer: updatePlayer.updatePlayer
}