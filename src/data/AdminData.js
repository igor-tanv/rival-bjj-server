const Contract = require('../models/contract')
const Player = require('../models/player')
const ContractData = require('./ContractData')

const updatePlayerRankById = async (playerId, result) => {
  const updatedPlayerRank = await Player.findOneAndUpdate({ _id: playerId }, result, { new: true })
  console.log('DATA',updatedPlayerRank)
}

module.exports = {
  updatePlayerRankById
}