const getContractByContractId = require('./getContractByContractId')
const getContractsByPlayerId = require('./getContractsByPlayerId')
const registerContract = require('./registerContract')
const registerJsonContract = require('./registerJsonContract')
const updateContract = require('./updateContract')
const getContractByDate = require('./getContractByDate')
const getMatchHistory = require('./getMatchHistory')

module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getContractsByPlayerId: getContractsByPlayerId.getContractsByPlayerId,
  registerContract: registerContract.registerContract,
  registerJsonContract: registerJsonContract.registerJsonContract,
  updateContract: updateContract.updateContract,
  getContractByDate: getContractByDate.getContractByDate,
  getMatchHistory: getMatchHistory.getMatchHistory
}