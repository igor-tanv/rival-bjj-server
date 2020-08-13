const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

enumStatus = {
  pending: 1,
  accepted: 2,
  declined: 3,
  completed: 4,
  cancelled: 5
}

const registerJsonContract = async (contract) => {
  contract.staus = enumStatus.pending
  const player = await PlayerData.getPlayerById(contract.playerId)
  const opponent = await PlayerData.getPlayerById(contract.opponentId)
  contract.playerRank = {
    gi: player.gi,
    nogi: player.nogi
  }
  contract.opponentRank = {
    gi: opponent.gi,
    nogi: opponent.nogi
  }
  return await ContractData.registerJsonContract(contract)

}

module.exports = {
  registerJsonContract,
  enumStatus
}