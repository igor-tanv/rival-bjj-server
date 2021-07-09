const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer } = require('./registerPlayer')
const { deletePlayerById } = require('./deletePlayerById')
const { updatePlayer } = require('./updatePlayer')
const { resetPlayerPassword } = require('./resetPlayerPassword')

module.exports = {
  getPlayers,
  getPlayer,
  registerPlayer,
  deletePlayerById,
  updatePlayer,
  resetPlayerPassword
}