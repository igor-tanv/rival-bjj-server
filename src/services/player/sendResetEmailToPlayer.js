const PlayerData = require('../../data/PlayerData')
const { sendPasswordResetEmail } = require('../../emails/account')


const sendResetEmailToPlayer = async (email) => {
  let player = await PlayerData.getPlayerByEmail(email)
  if (!player) return null
  await sendPasswordResetEmail(player)
  return player
}


module.exports = {
  sendResetEmailToPlayer
}