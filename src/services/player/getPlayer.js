const PlayerData = require('../../data/PlayerData')
const ContractData = require('../../data/ContractData')


function getFightRecord(player, contracts) {
  return {
    wins: contracts.filter((c) => (c.playerId.toString() === player.id.toString() && c.result === 'win') || (c.opponentId.toString() === player.id.toString() && c.result === 'loss')).length,
    losses: contracts.filter((c) => (c.opponentId.toString() === player.id.toString() && c.result === 'win') || (c.playerId.toString() === player.id.toString() && c.result === 'loss')).length,
    draws: contracts.filter((c) => c.result === 'draw').length,
  }
}

function getQualityRating(player, contracts) {
  let sumRating = []
  contracts.map((c) => {
    if (c.playerId.toString() === player.id.toString() && c.playerQualityRating != 0) sumRating.push(c.playerQualityRating)
    if (c.opponentId.toString() === player.id.toString() && c.playerQualityRating != 0) sumRating.push(c.opponentQualityRating)
    return
  })
  return { qualityRating: sumRating.length ? Math.round(sumRating.reduce((a, b) => a + b, 0) / sumRating.length) : 0 }
}

const addContractsRecordQualityratingToPlayer = async (player) => {
  let contracts = await ContractData.getContractsByPlayerOrOpponentId(player.id)
  const { wins, losses, draws } = getFightRecord(player, contracts)
  const { qualityRating } = getQualityRating(player, contracts)
  player = {
    ...player,
    qualityRating,
    wins,
    losses,
    draws,
    contracts: contracts ? contracts.sort((a, b) => b.datetime - a.datetime) : []
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