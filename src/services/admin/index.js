
const getAllContractsByDate = require('../admin/getAllContractsByDate')
const updatePlayerById = require('./updatePlayerById')

module.exports = {
  updatePlayerById: updatePlayerById.updatePlayerById,
  getAllContractsByDate: getAllContractsByDate.getAllContractsByDate
}