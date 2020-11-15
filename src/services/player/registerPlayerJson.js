
const Player = require('../../models/player')
const { sendWelcomeEmail, sendAdminEmail } = require('../../emails/account')


const registerPlayerJson = async (registration) => {
  try {
    const confirmationCode = require('crypto').randomBytes(3).toString("hex");
    let player = new Player({ ...registration, confirmationCode })
    await player.save()

    await sendWelcomeEmail(player)
    return ({ status: 200, data: player })
  }
  catch (err) {
    await sendAdminEmail(player)
    return ({ status: 400, data: err })
  }
}

module.exports = {
  registerPlayerJson
}
