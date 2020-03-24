const Contract = require('../models/contract')
const Player = require('../models/player')


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
  console.log('DATA', newPlayer)
  await newPlayer.save()
  return newPlayer
}

module.exports = {
  getAllPlayers,
  registerPlayer
}

