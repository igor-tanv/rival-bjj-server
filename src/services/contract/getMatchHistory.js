const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const weightClass = require('../../helpers/weight')
const matchDateHelper = require('../../helpers/matchDate')


const getMatchHistory = async (playerId) => {
  let allContracts = await Promise.all(await ContractData.getContractsByPlayerOrOpponentId(playerId))
  //return accepted and completed matches
  let contracts = allContracts.filter((contract) => {
    return (contract.status == 2 || contract.status == 4)
  })
  //create match history object
  contracts = contracts.map((contract) => {
    if(contract.winner == playerId) contract.result = 'Win'
    else if(contract.winner != contract.playerId && contract.winner != contract.opponentId ) contract.result = 'Draw'
    else {contract.result = 'Lose'}
    return {
      result: contract.result,
      opponent: contract.opponent,
      method: contract.method,
      date: matchDateHelper(contract.datetime),
      location: contract.location
    }
  })
  contracts.sort((a, b) => b.date - a.date)
  return contracts
}

module.exports = {
  getMatchHistory
}