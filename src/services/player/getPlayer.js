const PlayerData = require('../../data/PlayerData')
const ContractData = require('../../data/ContractData')

const addContractsRecordQualityratingToPlayer = async (player) => {
  let contracts = await ContractData.getContractsByPlayerOrOpponentId(player.id)
  let sumRating = []
  contracts.forEach((c) => {
    console.log(c.playerId.toString() === player.id.toString() && c.playerQualityRating != 0, 0)
    if (c.playerId.toString() === player.id.toString() && c.playerQualityRating != 0) sumRating.push(c.playerQualityRating)
    if (c.opponentId.toString() === player.id.toString() && c.playerQualityRating != 0) sumRating.push(c.opponentQualityRating)
  })
  player = {
    ...player._doc,
    qualityRating: sumRating.length ? Math.round(sumRating.reduce((a, b) => a + b, 0) / sumRating.length) : 0,
    wins: contracts.filter((c) => (c.playerId.toString() === player.id.toString() && c.result === 'win')).length,
    losses: contracts.filter((c) => (c.opponentId.toString() === player.id.toString() && c.result === 'win')).length,
    draws: contracts.filter((c) => c.result === 'draw').length,
    contracts: contracts
      ? contracts.sort((a, b) => b.datetime - a.datetime)
      : []
  }
  return player
}

const getPlayer = async (playerId) => {
  let player = await PlayerData.getPlayerById(playerId)
  return await addContractsRecordQualityratingToPlayer(player)
}

module.exports = {
  getPlayer,
  addContractsRecordQualityratingToPlayer
}