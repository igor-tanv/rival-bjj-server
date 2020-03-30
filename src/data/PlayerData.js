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

const deletePlayerById = async (id) => {
  try{
    await ContractData.deleteContractsByPlayerOrOpponentId(id) 
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
  deletePlayerById
}

