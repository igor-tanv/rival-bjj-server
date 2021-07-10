const { getPlayers } = require('./getPlayers')
const { getPlayer } = require('./getPlayer')
const { registerPlayer } = require('./registerPlayer')
const { deletePlayerById } = require('./deletePlayerById')
const { updatePlayer } = require('./updatePlayer')
const { sendPasswordEmail } = require('./sendPasswordEmail')
const { updatePassword } = require('./updatePassword')

module.exports = {
  getPlayers,
  getPlayer,
  registerPlayer,
  deletePlayerById,
  updatePlayer,
  sendPasswordEmail,
  updatePassword
}