const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer } = require('./registerPlayer')
const { deletePlayerById } = require('./deletePlayerById')
const { updatePlayer } = require('./updatePlayer')

module.exports = {
  getPlayers,
  getPlayer,
  registerPlayer,
  deletePlayerById,
  updatePlayer,
  ...require('./json')
}