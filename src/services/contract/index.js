const getContractByContractId = require('./getContractByContractId')
const getContractsByPlayerId = require('./getContractsByPlayerId')
const registerContract = require('./registerContract')
const updateContract = require('./updateContract')
const getContractByDate = require('./getContractByDate')
const getMatchHistory = require('./getMatchHistory')

const json = require('./json')


module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getContractsByPlayerId: getContractsByPlayerId.getContractsByPlayerId,
  registerContract: registerContract.registerContract,
  updateContract: updateContract.updateContract,
  getContractByDate: getContractByDate.getContractByDate,
  getMatchHistory: getMatchHistory.getMatchHistory,
  json: json
}