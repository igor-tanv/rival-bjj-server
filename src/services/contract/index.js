const getContractByContractId = require('./getContractByContractId')
const getAllContractsByPlayerId = require('./getAllContractsByPlayerId')
const createContract = require('./createContract')
const updateContract = require('./updateContract')
const getMatchHistory = require('./getMatchHistory')
const getAllContractsByDate = require('./getAllContractsByDate')

module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getAllContractsByPlayerId: getAllContractsByPlayerId.getAllContractsByPlayerId,
  createContract: createContract.createContract,
  acceptContract: updateContract.acceptContract,
  declineContract: updateContract.declineContract,
  cancelContract: updateContract.cancelContract,
  cancelAllPendingContracts: updateContract.cancelAllPendingContracts,
  getMatchHistory: getMatchHistory.getMatchHistory,
  getAllContractsByDate: getAllContractsByDate.getAllContractsByDate
}