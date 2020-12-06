const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const { sendAcceptContractEmail } = require('../../emails/account')

const acceptContract = async (contractId) => {
  const contract = await ContractData.acceptContract(contractId)
  const player = await PlayerData.getPlayerById(contract.playerId)
  await sendAcceptContractEmail(player, contract)
  return contract
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