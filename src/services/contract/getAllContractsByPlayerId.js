const ContractData = require('../../data/ContractData')

const getAllContractsByPlayerId = async (id) => {
  return ContractData.getContractsByPlayerOrOpponentId(id)
}

module.exports = {
  getAllContractsByPlayerId,
}