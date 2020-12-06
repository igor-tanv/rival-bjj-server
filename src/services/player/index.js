const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer } = require('./registerPlayer')
const { deletePlayerById } = require('./deletePlayerById')
const { updatePlayer } = require('./updatePlayer')
const { sendResetEmailToPlayer } = require('./sendResetEmailToPlayer')

module.exports = {
  getPlayers,
  getPlayer,
  registerPlayer,
  deletePlayerById,
  updatePlayer,
  sendResetEmailToPlayer,
  ...require('./json')
}