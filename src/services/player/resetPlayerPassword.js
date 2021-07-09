const jwt = require('jsonwebtoken');

const PlayerData = require('../../data/PlayerData')
const { sendPasswordResetEmail } = require('../../emails/account')


const resetPlayerPassword = async (email) => {
  let player = await PlayerData.getPlayerByEmail(email)
  if (!player) return null
  const token = generateToken(player)
  await sendPasswordResetEmail(player)
  return player
}

function generateToken(player) {
  return jwt.sign({
    id: player._id,
    email: player.email
  }, process.env.JWT_SECRET)
}


module.exports = {
  resetPlayerPassword
}