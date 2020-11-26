const PlayersData = require('../../data/PlayerData')

const getPlayers = async () => {
  return await PlayersData.getAllPlayers()
}

module.exports = {
  getPlayers,
}