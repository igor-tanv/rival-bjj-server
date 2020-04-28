const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const weightClass = require('../../helpers/weight')
const dateTimeHelper = require('../../helpers/datetime')

const getContract = async (contractId) => {
  let contract = await ContractData.getContractByContractId(contractId)
  if (contract.status === 200) {
    contract = contract.data
    let opponent = await PlayerData.getPlayerById(contract.opponentId)
    let player = await PlayerData.getPlayerById(contract.playerId)
    contract['date'] = dateTimeHelper.dateTimeHelper(contract.datetime)
    contract['kilos'] = weightClass.weightLimits(contract.weightClass)
    contract['opponent'] = {
      "avatar": opponent.avatar,
      "firstName": opponent.firstName,
      "lastName": opponent.lastName,
      "gi": opponent.gi,
      "nogi": opponent.nogi,
      "school": opponent.school
    }
    contract['player'] = {
      "avatar": player.avatar,
      "firstName": player.firstName,
      "lastName": player.lastName,
      "gi": player.gi,
      "nogi": player.nogi,
      "school": player.school
    }
    return ({ status: 200, data: contract })
  }
  return ({ status: 400, data: contract })
}

module.exports = {
  getContract
}