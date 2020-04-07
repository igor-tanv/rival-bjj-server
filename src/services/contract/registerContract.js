const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')


const registerContract = async (contract, playerId) => {
  let date = new Date();
  let timestamp = Math.round((date.getTime()) / 1000)
  let matchDate = (Date.parse(contract.datetime)) / 1000
  let threeMonths = 7776000

  if (timestamp > matchDate) {
    return ({status:400, data:'Date of Match cannot be in the past'})
   }

  if ((matchDate - timestamp) > threeMonths) { 
    return ({status:400, data:'Cannot set a match more than 3 months out'})
  }
  return await ContractData.registerContract(contract, playerId)
}

module.exports = {
  registerContract
}