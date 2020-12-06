const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const { sendIssueContractEmail } = require('../../emails/account')

const registerContract = async (contractDetails) => {

  const player = await PlayerData.getPlayerById(contractDetails.playerId)
  const opponent = await PlayerData.getPlayerById(contractDetails.opponentId)

  contractDetails.playerFirstName = player.firstName
  contractDetails.playerLastName = player.lastName
  contractDetails.opponentFirstName = opponent.firstName
  contractDetails.opponentLastName = opponent.lastName

  const contract = await ContractData.registerContract(contractDetails)
  sendIssueContractEmail(opponent, contract)
  return contract
}

module.exports = {
  registerContract
}