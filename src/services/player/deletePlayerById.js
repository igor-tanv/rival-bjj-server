const PlayersData = require('../../data/PlayerData')

const deletePlayerById = async (playerId) => {
  const delPlayer = await PlayersData.deletePlayerById(playerId)
  if (delPlayer.status === 200) {
    return ({status:200, data: delPlayer.data})
  }
  return ({status:400, data: delPlayer.data})
}

module.exports = {
  deletePlayerById
}
