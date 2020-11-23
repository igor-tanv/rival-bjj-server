
const Player = require('../../models/player')
const { sendWelcomeEmail, sendAdminEmail } = require('../../emails/account')
const ContractService = require('../contract')

const create = async (registration) => {
  try {
    const confirmationCode = require('crypto').randomBytes(3).toString("hex");
    let player = new Player({ ...registration, confirmationCode })
    await player.save()

    await sendWelcomeEmail(player)
    return ({ status: 200, data: player })
  }
  catch (err) {
    //await sendAdminEmail(player)
    return ({ status: 500, data: err })
  }
}

const update = async (id, attrs) => {
  try {
    // array updateable values (whitelisted attrs)
    // subtract the update attrs from the  whitelisted attrs
    // call update to mongo with only the key/values from the whitelisted attrs
    return ({ status: 200, data: player })
  }
  catch (err) {
    //await sendAdminEmail(player)
    return ({ status: 500, data: err })
  }
}

const deletePlayer = async (playerId) => {

  try {
    const player = await Player.findOneAndUpdate({ _id: playerId }, { deletedAt: new Date() }, { new: true })
    // cancel all pending contracts for that player
    return ({ status: 200, data: player })
  }
  catch (err) {
    return ({ status: 500, data: err })
  }
}


module.exports = {
  create,
  deletePlayer
}
