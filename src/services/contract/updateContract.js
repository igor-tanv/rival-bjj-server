const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const updateContractStatus = async (contractId, status) => {
  let updated = await ContractData.updateContract(contractId, status)
  if(updated.status === 200){
    return({status:200, data: updated})
  }
  return({status:400, data:'There was an error during the status update'})
}

module.exports = {
  updateContractStatus
}