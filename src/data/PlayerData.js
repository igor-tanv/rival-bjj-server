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
  const player = new Player(newPlayer)
  console.log('DATA', player)
  await player.save()
  return player
}

module.exports = {
  getAllPlayers,
  registerPlayer
}

