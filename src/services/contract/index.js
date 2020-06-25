// import { getContractByContractId } from './getContractByContractId'
// import { getContractsByPlayerId } from './getContractsByPlayerId'
// import { registerContract } from './registerContract'
// import { updateContract } from './updateContract'
// import { getContractByDate } from './getContractByDate'
// import { getMatchHistory } from './getMatchHistory'

const getContractByContractId = require('./getContractByContractId')
const getContractsByPlayerId = require('./getContractsByPlayerId')
const registerContract = require('./registerContract')
const updateContract = require('./updateContract')
const getContractByDate = require('./getContractByDate')
const getMatchHistory = require('./getMatchHistory')

module.exports = {
  getContractByContractId: getContractByContractId.getContractByContractId,
  getContractsByPlayerId: getContractsByPlayerId.getContractsByPlayerId,
  registerContract: registerContract.registerContract,
  updateContract: updateContract.updateContract,
  getContractByDate: getContractByDate.getContractByDate,
  getMatchHistory: getMatchHistory.getMatchHistory
}