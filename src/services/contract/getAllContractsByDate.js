const ContractData = require('../../data/ContractData')

const getAllContractsByDate = async (date) => {
  date = new Date(date)
  console.log(5, date)
  const test = await ContractData.getAllContractsByDate(date)
  console.log(7, test)
  return test
}

module.exports = {
  getAllContractsByDate
}
