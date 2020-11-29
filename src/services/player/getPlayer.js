const PlayerData = require('../../data/PlayerData')
const ContractData = require('../../data/ContractData')


export function addFightRecordToPlayer(player, contracts) {
  player.wins = contracts.filter((c) => (c.playerId.toString() === player.id.toString() && c.result === 'win') || (c.opponentId.toString() === player.id.toString() && c.result === 'loss')).length
  player.losses = contracts.filter((c) => (c.opponentId.toString() === player.id.toString() && c.result === 'win') || (c.playerId.toString() === player.id && c.result === 'loss')).length
  player.draws = contracts.filter((c) => c.result === 'draw').length
  return player
}

const getPlayer = async (playerId) => {
  const player = await PlayerData.getPlayerById(playerId)
  const contracts = await ContractData.getContractsByPlayerOrOpponentId(playerId)
  return addFightRecordToPlayer(player, contracts)
}

module.exports = {
  getPlayer,
}