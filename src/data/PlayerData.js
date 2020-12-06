const Player = require('../models/player')


const getPlayerById = async (playerId) => {
  return await Player.findById(playerId)
}

const getPlayerByEmail = async (email) => {
  return await Player.findOne(email)
}

const getAllPlayers = async () => {
  return Player.find(function (err, players) {
    if (err) return err
    return players
  })
}

const registerPlayer = async (registration, confirmationCode) => {
  const player = new Player({ ...registration, confirmationCode })
  await player.save()
  return player
}

const updatePlayer = async (playerId, updates) => {
  return await Player.findOneAndUpdate({ _id: playerId }, updates, { new: true })
}

const deletePlayerById = async (id) => {
  try {
    const player = await Player.findOneAndUpdate({ _id: id }, { deletedAt: new Date() }, { new: true })
    return ({ status: 200, data: player })

  } catch (e) {
    return ({ status: 400, data: e })
  }
}

module.exports = {
  getAllPlayers,
  registerPlayer,
  getPlayerById,
  deletePlayerById,
  updatePlayer,
  getPlayerByEmail
}

