const Contract = require('../models/contract')


const getContractByContractId = async (contractId) => {
  try {
    const contract = await Contract.findById(contractId)
    return ({ status: 200, data: contract })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

const getContractsByPlayerId = async (playerId) => {
  return await Contract.find({ playerId })
}

const getContractsByOpponentId = async (opponentId) => {
  return await Contract.find({ opponent_id: opponentId })
}

const getContractsByPlayerOrOpponentId = async (Id) => {
  return await Contract.find({ $or: [{ playerId: Id }, { opponentId: Id }] }).sort({ startsAt: 'desc' })
}

const createContract = async (data) => {
  const contract = new Contract({ ...data })
  return await contract.save()
}

const acceptContract = async (contractId) => {
  return await Contract.findOneAndUpdate(
    { _id: contractId },
    { acceptedAt: new Date() },
    {
      new: true
    })
}

const declineContract = async (contractId) => {
  return await Contract.findOneAndUpdate(
    { _id: contractId },
    {
      declinedAt: new Date(),
      result: matchResult.cancelled
    },
    { new: true })
}

const cancelContract = async (contractId, cancelledBy) => {
  return await Contract.findOneAndUpdate(
    { _id: contractId },
    {
      cancelledAt: new Date(),
      cancelledBy,
      result: matchResult.cancelled
    },
    { new: true })
}

const cancelAllPendingContracts = async (cancelledBy, pendingContractIds) => {
  return await Contract.updateMany(
    { _id: { $in: pendingContractIds } },
    {
      $set:
      {
        cancelledAt: new Date(),
        cancelledBy,
        result: matchResult.cancelled
      }
    },
    { multi: true }
  )
}

const updateContract = async (contractId, updates) => {
  try {
    const updated = await Contract.findOneAndUpdate({ id: contractId }, updates, { new: true })
    return ({ status: 200, data: updated })
  } catch (e) {
    return ({ status: 400, data: e })
  }
}

const getAllContractsByDate = async (date) => {
  return await Contract.find({ 'startsAt': date })
}

module.exports = {
  createContract,
  getContractsByOpponentId,
  getContractsByPlayerId,
  cancelAllPendingContracts,
  getContractsByPlayerOrOpponentId,
  getContractByContractId,
  acceptContract,
  declineContract,
  cancelContract,
  getAllContractsByDate,
  updateContract
}