const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer } = require('./registerPlayer')
const { registerPlayerJson } = require('./registerPlayerJson')
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