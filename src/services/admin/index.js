
const getAllContractsByDate = require('../admin/getAllContractsByDate')
const updateContractByContractId = require('./updateContractByContractId')

module.exports = {
  getAllContractsByDate: getAllContractsByDate.getAllContractsByDate,
  updateContractByContractId: updateContractByContractId.updateContractByContractId
}