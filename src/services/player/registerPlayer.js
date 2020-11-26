const PlayerData = require('../../data/PlayerData')
const { sendWelcomeEmail, sendAdminEmail } = require('../../emails/account')

const registerPlayer = async (registration) => {
  try {
    const confirmationCode = require('crypto').randomBytes(3).toString("hex");
    const player = await PlayerData.registerPlayer(registration, confirmationCode)
    console.log(10, player)
    await sendWelcomeEmail(player)
    return ({ status: 200, data: player })
  }
  catch (err) {
    //await sendAdminEmail(player)
    return ({ status: 500, data: err })
  }
}


module.exports = {
  registerPlayer
}
