const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const registerContract = async (contract) => {

  const player = await PlayerData.getPlayerById(contract.playerId)
  const opponent = await PlayerData.getPlayerById(contract.opponentId)

  contract.playerFirstName = player.firstName
  contract.playerLastName = player.lastName
  contract.opponentFirstName = opponent.firstName
  contract.opponentLastName = opponent.lastName

  return await ContractData.registerContract(contract)

}

module.exports = {
  registerContract
}