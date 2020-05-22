const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const weightClass = require('../../helpers/weight')
const dateTimeHelper = require('../../helpers/datetime')

const getContractsByPlayerId = async (id) => {
  let contracts = await ContractData.getContractsByPlayerOrOpponentId(id)
  const processedContracts = contracts.map(async (contract) => {
    let opponent;
    if (id == contract.playerId) {
      opponent = await PlayerData.getPlayerById(contract.opponentId)
    }
    else {
      opponent = await PlayerData.getPlayerById(contract.playerId)
    }
    contract['date'] = dateTimeHelper.dateTimeHelper(contract.datetime)
    if (opponent) {
      contract['opponent'] = {
        "avatar": opponent.avatar,
        "first": opponent.firstName,
        "last": opponent.lastName,
        "school": opponent.school
      }
    }
    return contract
  })
  return processedContracts
}

module.exports = {
  getContractsByPlayerId,
}