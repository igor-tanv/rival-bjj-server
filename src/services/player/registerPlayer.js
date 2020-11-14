const fs = require('fs')
const path = require('path')
const paths = require('../../paths')
const sharp = require('sharp')
const PlayersData = require('../../data/PlayerData')
const Player = require('../../models/player')
const e = require('express')
const { sendWelcomeEmail, sendAdminEmail } = require('../../emails/account')

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
    const confirmationCode = require('crypto').randomBytes(3).toString("hex");
    let player = new Player({ ...registration, confirmationCode })
    await player.save()

    await sendWelcomeEmail(player)
    return ({ status: 200, data: player })
  }
  catch (err) {
    await sendWelcomeEmail(player)
    return ({ status: 400, data: err })
  }
}

module.exports = {
  registerPlayer,
  registerPlayerJson
}
