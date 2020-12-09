const ContractData = require('../../data/ContractData')

const getContractByDate = async (datetime) => {
  let date = (Date.parse(datetime)) / 1000
  return await ContractData.getContractByDate(date)
}

module.exports = {
  getContractByDate
}