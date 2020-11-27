const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const acceptContract = async (contractId) => {
  return await ContractData.acceptContract(contractId)
}

const declineContract = async (contractId) => {
  return await ContractData.declineContract(contractId)
}

const cancelContract = async (contractId, cancelledBy) => {
  return await ContractData.cancelContract(contractId, cancelledBy)
}

module.exports = {
  acceptContract,
  declineContract,
  cancelContract
}