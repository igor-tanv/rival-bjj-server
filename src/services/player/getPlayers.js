
const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  const players = await PlayersData.getAllPlayers()
  players.forEach((player) => {
    player.avatar = player.avatar.toString('base64')
  })
  players.sort((a, b) => b.nogi - a.nogi)
  return players
}

module.exports = {
  getPlayers
}