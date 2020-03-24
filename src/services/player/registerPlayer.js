const PlayersData = require('../../data/PlayerData')
const sharp = require('sharp')

const registerPlayer = async (buffer, newPlayer) => {
    newPlayer.avatar = await sharp(buffer).resize({ width: 150, height: 150 }).png().toBuffer()
    console.log('SERVICE',newPlayer)
    return await PlayersData.registerPlayer(newPlayer)
}
module.exports = {
  registerPlayer
}