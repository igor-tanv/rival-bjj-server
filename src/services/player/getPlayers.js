const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  const players = await PlayersData.getAllPlayers()
  return players.filter(p => p.confirmedAt != null && p.deletedAt === null)
}

module.exports = {
  getPlayers,
}