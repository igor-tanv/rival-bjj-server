const PlayerData = require('../../data/PlayerData')
const { sendWelcomeEmail } = require('../../emails/account')

const registerPlayer = async (registration) => {
  try {
    const confirmationCode = require('crypto').randomBytes(3).toString("hex");
    const player = await PlayerData.registerPlayer(registration, confirmationCode)
    await sendWelcomeEmail(player)
    return ({ status: 200, data: player })
  }
  catch (err) {
    //await sendAdminEmail()
    return ({ status: 500, data: err })
  }
}


module.exports = {
  registerPlayer
}
