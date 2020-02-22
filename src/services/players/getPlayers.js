const Player = require('../../models/player')

module.exports = async (req, res) => {

  const players = await Player.find()
  // Convert player avatar to base64 String
  players.forEach((player) => {
    player.avatar = player.avatar.toString('base64')
  })
  //sort by nogiRank from high to low
  players.sort((a, b) => b.nogi - a.nogi)
  return res.json({ status: 200, data: players })
}
