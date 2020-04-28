const PlayersData = require('../../data/PlayerData')

const getPlayer = async (playerId) => {
  const player = await PlayersData.getPlayerById(playerId)
  return player
}

module.exports = {
  getPlayer,
}