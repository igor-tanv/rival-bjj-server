const fs = require('fs')
const path = require('path')
const paths = require('../../paths')
const sharp = require('sharp')
const PlayersData = require('../../data/PlayerData')
const Player = require('../../models/player')
const e = require('express')

const registerPlayer = async (registration, avatar) => {
  try {
    let player = new Player(registration)
    if (avatar) {
      const arrFile = avatar.path.split('/')
      player.avatar = arrFile[arrFile.length - 1]
    }
    const newPlayer = await PlayersData.registerPlayer(player)
    return ({ status: 200, data: newPlayer })
  }
  catch (err) {
    return ({ status: 400, data: err })
  }
}

const registerPlayerJson = async (registration) => {
  try {
    let player = new Player(registration)
    if (registration.avatar) {
      const avatar = new Buffer.from(registration.avatar, 'base64')
      console.log(29, avatar)
      const avatarFileName = player.email.replace(/@/g, "-").replace(/\./g, "-") + ".png"
      sharp(avatar).resize({ width: 250, height: 250 }).toBuffer()
        .then(data => fs.writeFileSync(path.join(paths.PUBLIC.AVATAR_PICTURES, avatarFileName), data)).catch((e) => console.log('error', e))
      player.avatar = avatarFileName
    }
    const newPlayer = await PlayersData.registerPlayer(player)
    return ({ status: 200, data: newPlayer })
  }
  catch (err) {
    return ({ status: 400, data: err })
  }
}

module.exports = {
  registerPlayer,
  registerPlayerJson
}
