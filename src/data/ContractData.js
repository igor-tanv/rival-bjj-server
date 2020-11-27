const Contract = require('../models/contract')

const getContractByDate = async (date) => {
  return await Contract.find({ 'datetime': date })
}

const getContractByContractId = async (contractId) => {
  try {
    const contract = await Contract.findById(contractId)
    return ({ status: 200, data: contract })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

const getContractsByPlayerId = async (playerId) => {
  return await Contract.find({ 'player_id': playerId })
}

const getContractsByOpponentId = async (opponentId) => {
  return await Contract.find({ 'opponent_id': opponentId })
}

const getContractsByPlayerOrOpponentId = async (Id) => {
  return await Contract.find({ $or: [{ playerId: Id }, { opponentId: Id }] })
}

const deleteContractsByPlayerOrOpponentId = async (Id) => {
  try {
    await Contract.deleteMany({ $or: [{ playerId: Id }, { opponentId: Id }] })
    return ({ status: 200, data: 'All Contracts deleted successfully' })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

//when a player deletes his profile all unresolved contracts will be deleted as well 
const deleteUnresolvedContracts = async (Id) => {
  try {
    // deletes objects with a status 1 or 2 and playerId or opponentId
    await Contract.deleteMany({ $and: [{ status: { $in: [1, 2] } }, { $or: [{ playerId: Id }, { opponentId: Id }] }] })
    return ({ status: 200, data: 'All pending contracts deleted successfully' })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

const registerContract = async (data) => {
  const contract = new Contract({ ...data })
  return await contract.save()
}


const updateContract = async (contractId, updates) => {
  try {
    const updated = await Contract.findOneAndUpdate({ _id: contractId }, updates, { new: true })
    return ({ status: 200, data: updated })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

module.exports = {
  getContractByDate,
  registerContract,
  getContractsByOpponentId,
  getContractsByPlayerId,
  getContractsByPlayerOrOpponentId,
  deleteContractsByPlayerOrOpponentId,
  getContractByContractId,
  updateContract,
  deleteUnresolvedContracts
}