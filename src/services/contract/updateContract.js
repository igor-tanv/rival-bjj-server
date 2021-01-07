const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const { sendAcceptContractEmail, sendDeclineContractEmail, sendCancelContractEmail } = require('../../emails/account')

const acceptContract = async (contractId) => {
  const contract = await ContractData.acceptContract(contractId)
  const player = await PlayerData.getPlayerById(contract.playerId)
  await sendAcceptContractEmail(player, contract)
  return contract
}

const declineContract = async (contractId) => {
  const contract = await ContractData.declineContract(contractId)
  const player = await PlayerData.getPlayerById(contract.playerId)
  await sendDeclineContractEmail(player, contract)
  return contract
}

const cancelContract = async (contractId, cancelledBy) => {
  const contract = await ContractData.cancelContract(contractId, cancelledBy)
  const player = await PlayerData.getPlayerById(contract.playerId)
  const opponent = await PlayerData.getPlayerById(contract.opponentId)
  player.id === cancelledBy ? sendCancelContractEmail(opponent, player) : sendCancelContractEmail(player, opponent)
  return contract
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