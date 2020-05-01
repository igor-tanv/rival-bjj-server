const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const enumStatus = require('./registerContract')

const updateContract = async (contractId, status) => {
  let contract = await ContractData.getContractByContractId(contractId)
  if (contract.status === 200) {
    contract = contract.data
    status = status.status
    let opponent = await PlayerData.getPlayerById(contract.opponentId)
    let player = await PlayerData.getPlayerById(contract.playerId)
    let opponentRank = { gi: opponent.gi, nogi: opponent.nogi }
    let playerRank = { gi: player.gi, nogi: player.nogi }
    let updated = await ContractData.updateContract(contractId, { status, opponentRank, playerRank })
    if (updated.status === 200) return updated
  }
  else if (contract.status == 400) {
    return ({status:400, data: 'There was an error during the status update'})
  }
}

module.exports = {
  updateContract
}