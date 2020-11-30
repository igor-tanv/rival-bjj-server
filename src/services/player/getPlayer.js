const PlayerData = require('../../data/PlayerData')
const ContractData = require('../../data/ContractData')


const addContractsRecordQualityratingToPlayer = async (player) => {
  let contracts = await ContractData.getContractsByPlayerOrOpponentId(player.id)
  player = {
    ...player._doc,
    qualityRating: player.qualityRating,
    wins: contracts.filter((c) => (c.playerId.toString() === player.id.toString() && c.result === 'win') || (c.opponentId.toString() === player.id.toString() && c.result === 'loss')).length,
    losses: contracts.filter((c) => (c.opponentId.toString() === player.id.toString() && c.result === 'win') || (c.playerId.toString() === player.id && c.result === 'loss')).length,
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