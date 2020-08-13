const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

enumStatus = {
  pending: 1,
  accepted: 2,
  declined: 3,
  completed: 4,
  cancelled: 5
}

const registerJsonContract = async (contract) => {
  contract.staus = enumStatus.pending
  return await ContractData.registerJsonContract(contract)
}

module.exports = {
  registerJsonContract,
  enumStatus
}