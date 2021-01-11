const ContractData = require('../../data/ContractData')

const getAllContractsByDate = async (date) => {
  return await ContractData.getAllContractsByDate(date)
}

module.exports = {
  getAllContractsByDate
}
