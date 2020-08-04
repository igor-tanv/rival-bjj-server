// import { getPlayers } from './getPlayers'
// import { getPlayer } from './getPlayer'
// import { registerPlayer } from './registerPlayer'
// import { deletePlayerById } from './deletePlayerById'
// import { updatePlayer } from './updatePlayer'

const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer, registerPlayerJson } = require('./registerPlayer')
const { deletePlayerById } = require('./deletePlayerById')
const { updatePlayer } = require('./updatePlayer')

module.exports = {
  getPlayers,
  getPlayer,
  registerPlayer,
  registerPlayerJson,
  deletePlayerById,
  updatePlayer
}