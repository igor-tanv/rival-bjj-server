const Contract = require('../../models/contract')
const PlayerData = require('../../data/PlayerData')

const find = async (id) => {
  return await Contract.find({ _id: id })
}

const getAllByPlayerId = async (playerId) => {
  return await Contract.find({ $or: [{ 'playerId': playerId }, { 'opponentId': playerId }] })
}

const cancelAllPendingByPlayerId = async (playerId) => {
  const playerContracts = await Contract.find({ $or: [{ 'playerId': playerId }, { 'opponentId': playerId }] })
  return
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