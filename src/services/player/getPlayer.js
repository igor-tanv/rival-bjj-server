const PlayersData = require('../../data/PlayerData')

const getPlayer = async (playerId) => {
  return await PlayersData.getPlayerById(playerId)
}

module.exports = {
  getPlayer,
}