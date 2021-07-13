const PlayerData = require('../../data/PlayerData')
const bcrypt = require('bcryptjs')


const updatePassword = async (password, id) => {
  let player = await PlayerData.getPlayerById(id)
  if (!player) return null
  const newPassword = await bcrypt.hash(password, 8)
  return await PlayerData.updatePlayer(id, { password: newPassword })
}

module.exports = {
  updatePassword
}