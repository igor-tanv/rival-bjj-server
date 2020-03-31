const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const updateContractStatus = async (contractId, status) => {
  let updated = await ContractData.updateContract(contractId, status)
  if(updated.status === 200){
    return(updated)
  }
  updated.data = 'There was an error during the status update'
  return(updated)
}

module.exports = {
  updateContractStatus
}