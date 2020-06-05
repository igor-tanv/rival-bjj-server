const Contract = require('../models/contract')
const Player = require('../models/player')
const ContractData = require('./ContractData')


const getPlayerById = async (playerId) => {
  return await Player.findById(playerId)
}

const getAllPlayers = async () => {
  return Player.find(function (err, players) {
    if (err) return err
    return players
  })
}

const registerPlayer = async (newPlayer) => {
  return await newPlayer.save()
}

const updatePlayer = async (playerId, updates) => {
  return await Player.findOneAndUpdate({ _id: playerId }, updates, { new: true })
}

const deletePlayerById = async (id) => {
  try{
    //delete pending contracts
    await ContractData.deleteUnresolvedContracts(id)
    const player = await Player.findByIdAndDelete({_id: id})
    return ({ status: 200, data: player })

  } catch(e) {
    return ({ status: 400, data: e })
  }
}

module.exports = {
  getAllPlayers,
  registerPlayer,
  getPlayerById,
  deletePlayerById,
  updatePlayer
}

