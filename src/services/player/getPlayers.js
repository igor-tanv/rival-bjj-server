const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  const players = await PlayersData.getAllPlayers()
  return players
}

module.exports = {
  getPlayers,
}