
const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  const players = await PlayersData.getAllPlayers()
  players.sort((a, b) => b.nogi - a.nogi)
  return players
}

const getPlayer = async (playerId) => {
  const player = await PlayersData.getPlayerById(playerId)
  return player
}

module.exports = {
  getPlayers,
  getPlayer
}