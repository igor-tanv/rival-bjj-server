const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const weightClass = require('../../helpers/weight')

const getContract = async (contractId) => {
  let contract = await ContractData.getContractByContractId(contractId)
  if (contract.status === 200) {
    contract = contract.data
    let opponent = await PlayerData.getPlayerById(contract.opponentId)
    let player = await PlayerData.getPlayerById(contract.playerId)
    date = new Date(contract.datetime * 1000)
    let months = ["", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    let month = months[date.getMonth()]
    let minutes = date.getMinutes()
    if (minutes == 0) {
      minutes = '00'
    }
    contract['date'] = {
      "year": date.getFullYear(),
      month,
      "day": date.getDate(),
      "hour": date.getHours(),
      minutes
    }

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