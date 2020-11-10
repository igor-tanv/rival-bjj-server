const Contract = require('../../models/contract')
const PlayerData = require('../../data/PlayerData')

const getAllByPlayerId = async (playerId) => {
  return await Contract.find({ playerId: playerId })
}

const create = async (data) => {
  const player = await PlayerData.getPlayerById(data.playerId)
  const opponent = await PlayerData.getPlayerById(data.opponentId)
  const contract = new Contract({
    ...data,
    dateTime: Math.round(Date.parse(data.dateTime) / 1000),
    playerFirstName: player.firstName,
    playerLastName: player.lastName,
    opponentFirstName: opponent.firstName,
    opponentLastName: opponent.lastName,
  })
  return await contract.save()
}

module.exports = {
  getAllByPlayerId,
  create,
}