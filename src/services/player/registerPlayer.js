const PlayersData = require('../../data/PlayerData')
const sharp = require('sharp')
const Player = require('../../models/player')

const registerPlayer = async (registration, avatar) => {
  try {
    player = new Player(registration)
    if (avatar) {
      const arrFile = avatar.path.split('/')
      player.avatar = arrFile[arrFile.length - 1]
    }
    return await PlayersData.registerPlayer(newPlayer)

    //return res.json({ status: 200, data: player })

  }
  catch (err) {
    console.log('ERROR', err)
    return ({ status: 400, data: err })
  }
}
module.exports = {
  registerPlayer
}
