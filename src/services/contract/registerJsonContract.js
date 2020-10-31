const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

enumStatus = {
  Pending: 1,
  Accepted: 2,
  Declined: 3,
  Completed: 4,
  Cancelled: 5
}

const registerJsonContract = async (contract) => {
  contract.dateTime = (Date.parse(contract.dateTime)) / 1000
  contract.staus = enumStatus.Pending
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