const getContractByContractId = require('./getContractByContractId')
const getAllContractsByPlayerId = require('./getAllContractsByPlayerId')
const createContract = require('./createContract')
const updateContract = require('./updateContract')
const getContractByDate = require('./getContractByDate')
const getMatchHistory = require('./getMatchHistory')

module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getAllContractsByPlayerId: getAllContractsByPlayerId.getAllContractsByPlayerId,
  createContract: createContract.createContract,
  acceptContract: updateContract.acceptContract,
  declineContract: updateContract.declineContract,
  cancelContract: updateContract.cancelContract,
  cancelAllPendingContracts: updateContract.cancelAllPendingContracts,
  getContractByDate: getContractByDate.getContractByDate,
  getMatchHistory: getMatchHistory.getMatchHistory
  //...require('./json')
}