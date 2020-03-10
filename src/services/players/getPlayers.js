const Player = require('../../models/player')

module.exports = async (req, res) => {
  let players = await Player.find()
  players.sort((a, b) => b.nogi - a.nogi)
  return res.json({ status: 200, data: players })
}

// Convert player avatar to base64 String
 // players = players.map((player) => {
   // player.avatar = player.avatar.toString('base64')
   // console.log(9, player.avatar, player.avatar.toString('base64'))
  //return player
 // })
  //sort by nogiRank from high to low
