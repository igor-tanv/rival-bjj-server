const Contract = require('../models/contract')

const getContractById = async (contractId) => {
  return Contract.findById(contractId)
}

const getContractsByPlayerId = async (playerId) => {
  return Contract.find({ 'player_id': playerId })
}

const getContractsByOpponentId = async (opponentId) => {
  return Contract.find({ 'opponent_id': opponentId })
}

const registerContract = async (contract, playerId) => {
  const requiredFields = ['rules','datetime','school','referee']
  try {
      let newContract = new Contract({
        rules: contract.rules,
        datetime: (Date.parse(contract.datetime)) / 1000,
        school: contract.school,
        comments: contract.comments,
        playerId,
        opponentId: contract.opponentId,
        referee: contract.referee
      })
      let result = await newContract.save()
      return ({ status: 200, data: result })
  } catch (e) {
      let errArray = requiredFields.map((field) =>{
        if(e.errors[field] != undefined){
          return e.errors[field].path
        }
      }).filter((path)=>{
        return path != undefined
      })
      return ({ status: 400, data: 'Missing fields: '+ errArray })
  }
}

module.exports = {
  registerContract
}