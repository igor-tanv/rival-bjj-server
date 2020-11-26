const getContractByContractId = require('./getContractByContractId')
const getAllContractsByPlayerId = require('./getAllContractsByPlayerId')
const registerContract = require('./registerContract')
const updateContract = require('./updateContract')
const getContractByDate = require('./getContractByDate')
const getMatchHistory = require('./getMatchHistory')



module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getAllContractsByPlayerId: getAllContractsByPlayerId.getAllContractsByPlayerId,
  registerContract: registerContract.registerContract,
  updateContract: updateContract.updateContract,
  getContractByDate: getContractByDate.getContractByDate,
  getMatchHistory: getMatchHistory.getMatchHistory,
  ...require('./json')
}