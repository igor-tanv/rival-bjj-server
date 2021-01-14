
const getAllContractsByDate = require('../admin/getAllContractsByDate')
const updatePlayerById = require('./updatePlayerById')
const updateContractByContractId = require('./updateContractByContractId')

module.exports = {
  updatePlayerById: updatePlayerById.updatePlayerById,
  getAllContractsByDate: getAllContractsByDate.getAllContractsByDate,
  updateContractByContractId: updateContractByContractId.updateContractByContractId
}