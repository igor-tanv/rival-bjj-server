const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const dateTimeHelper = require('../../helpers/datetime')



const getMatchHistory = async (playerId) => {
  let allContracts = await Promise.all(await ContractData.getContractsByPlayerOrOpponentId(playerId))
  //return accepted and completed matches
  let contracts = allContracts.filter((contract) => {
    return (contract.status == 2 || contract.status == 4)
  })
  //create match history object
  contracts = contracts.map(async (contract) => {
    let opponentId = [contract.playerId, contract.opponentId].filter((id) => id != playerId)
    let opponent = await PlayerData.getPlayerById(opponentId)
    //if opponent has deleted his profile get name from contract
    if (!opponent) {
      if (contract.playerId == playerId) {
        opponent = {
          firstName: contract.opponentFirstName,
          lastName: contract.opponentLastName
        }
      } else if (contract.opponentId == playerId) {
        opponent = {
          firstName: contract.playerFirstName,
          lastName: contract.playerLastName
        }
      }
    }
    if (!contract.winner) contract.result = 'Pending'
    else if (contract.winner) {
      if (contract.winner == playerId) contract.result = 'Win'
      else if (contract.winner != contract.playerId && contract.winner != contract.opponentId) contract.result = 'Draw'
      else { contract.result = 'Loss' }
    }
    //datetime property is not displayed but used for sorting match history in GET player profile route
    return {
      result: contract.result,
      rules: contract.rules,
      opponent: opponent,
      method: contract.method,
      date: dateTimeHelper.dateTimeHelper(contract.datetime),
      location: contract.location,
      weightClass: contract.weightClass,
      datetime: contract.datetime
    }
  })
  return contracts
}

module.exports = {
  getMatchHistory
}