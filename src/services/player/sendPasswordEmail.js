const jwt = require('jsonwebtoken');

const PlayerData = require('../../data/PlayerData')
const { sendPasswordResetEmail } = require('../../emails/account')

//TODO change name to sendPasswordEmail
const sendPasswordEmail = async (email) => {
  let player = await PlayerData.getPlayerByEmail(email)
  if (!player) return null
  const token = generateToken(player)
  await sendPasswordResetEmail(player, token)
  return player
}

//TODO token needs to have expiry date
function generateToken(player) {
  return jwt.sign({
    id: player._id,
    email: player.email
  }, process.env.JWT_SECRET)
}


module.exports = {
  sendPasswordEmail
}