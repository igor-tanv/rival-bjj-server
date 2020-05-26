const PlayersData = require('../../data/PlayerData')

const updatePlayer = async (playerId, updates) => {
  console.log('id',playerId, 'updates',updates)
  const player = await PlayersData.updatePlayer(playerId)
  return
}

module.exports = {
  updatePlayer,
}