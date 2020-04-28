const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const updateContract = async (contractId, status) => {
  let contract = await ContractData.getContractByContractId(contractId)
  if (contract.status === 200) {
    contract = contract.data
    let opponent = await PlayerData.getPlayerById(contract.opponentId)
    let player = await PlayerData.getPlayerById(contract.playerId)
    let opponentRank = { gi: opponent.gi, nogi: opponent.nogi }
    let playerRank = { gi: player.gi, nogi: player.nogi }
    //fix this hack 
    status = status.status
    let updated = await ContractData.updateContract(contractId, { status, opponentRank, playerRank })
    if (updated.status === 200) {
      return (updated)
    }
  }

  updated.data = 'There was an error during the status update'
  return (updated)
}

module.exports = {
  updateContract
}