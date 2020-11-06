const Contract = require('../../models/contract')
const PlayerData = require('../../data/PlayerData')

const search = async (params) => {
  return await Contract.find({ params })
}

const create = async (data) => {
  try {
    const player = await PlayerData.getPlayerById(contract.playerId)
    const opponent = await PlayerData.getPlayerById(contract.opponentId)
    const contract = new Contract({
      ...data,
      dateTime: Math.round(Date.parse(data.dateTime) / 1000),
      playerRank: { gi: player.gi, nogi: player.nogi },
      opponentRank: { gi: opponent.gi, nogi: opponent.nogi },
    })

    return await contract.save()
  } catch (e) {
    return ({ status: 400, error: e })
  }
}

module.exports = {
  search,
  create,
}