const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  return await PlayersData.getAllPlayers().filter(p => p.confirmedAt != null && p.deletedAt === null)
}

module.exports = {
  getPlayers,
}