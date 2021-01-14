const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const AdminData = require('../../data/AdminData')
const contractServices = require('../contract/createContract')

const methodValues = {
  submission: 1,
  disqualification: 1,
  forfeit: 1,
  injury: 1,
  points: 0.75,
  draw: 0.5,
  advantage: 0.25
}

const updateContractByContractId = async (contractId, contractData) => {
  const { winner, method, redRating, blueRating, refereeComments } = contractData
  console.log(18, contractData)

  if (winner === '') return

  // update contract

  if (winner === 'cancelled') {
    // update contract status to cancelled and return
    return await ContractData.cancelContract(contractId)
  }

  let result = ''
  if (winner === 'red') result = 'win'
  if (winner === 'blue') result = 'loss'
  if (winner === 'draw') result = 'draw'

  const test = await ContractData.updateContract(contractId, {
    result,
    playerQualityRating: parseInt(redRating),
    opponentQualityRating: parseInt(blueRating),
    method,
    refereeComments,
    completedAt: new Date()
  })

  console.log(test)
  return test

  //update player ranks
  let red = await PlayerData.getPlayerById(contract.playerId)
  let blue = await PlayerData.getPlayerById(conctract.opponentId)
  return null
}

module.exports = {
  updateContractByContractId
}
