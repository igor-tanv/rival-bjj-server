const PlayersData = require('../../data/PlayerData')

const deletePlayerById = async (playerId) => {
  const player = await PlayersData.deletePlayerById(playerId)
  if (player.status === 200) return ({ status: 200, data: player.data })
  return ({ status: 400, data: player.data })
}

module.exports = {
  deletePlayerById
}
