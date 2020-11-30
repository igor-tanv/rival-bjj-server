const ContractData = require('../../data/ContractData')

const acceptContract = async (contractId) => {
  return await ContractData.acceptContract(contractId)
}

const declineContract = async (contractId) => {
  return await ContractData.declineContract(contractId)
}

const cancelContract = async (contractId, cancelledBy) => {
  return await ContractData.cancelContract(contractId, cancelledBy)
}

const cancelAllPendingContracts = async (cancelledBy) => {
  const contracts = await ContractData.getContractsByPlayerOrOpponentId(cancelledBy)
  const pendingContractIds = contracts.filter((c) => c.status === 'accepted' || c.status === 'sent').map((fc) => fc.id,)
  return await ContractData.cancelAllPendingContracts(cancelledBy, pendingContractIds)
}

module.exports = {
  acceptContract,
  declineContract,
  cancelContract,
  cancelAllPendingContracts
}