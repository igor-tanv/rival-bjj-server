const PlayersData = require('../../data/PlayerData')
const sharp = require('sharp')
const Player = require('../../models/player')

const registerPlayer = async (registration, avatar) => {
  
  try {
    
    // if (avatar) {
    //   const arrFile = avatar.path.split('/')
    //   player.avatar = arrFile[arrFile.length - 1]
    // }
    const player = await PlayersData.registerPlayer((new Player(registration)))
    console.log('SERVICE',player)
    return res.json({ status: 200, data: player })

  }
  catch (err) {
    console.log('ERROR', err)
    return ({ status: 400, data: err })
  }
}
module.exports = {
  registerPlayer
}
