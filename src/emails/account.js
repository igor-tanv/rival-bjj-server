const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const host = process.env.HOST
const email = async (recipient, title, body) => {
    await sgMail.send({
        to: recipient,
        from: process.env.FROM_EMAIL,
        subject: title,
        text: body
    })
}

const sendWelcomeEmail = async (player) => {
    try {
        email(player.email, `Welcome to Rival, ${player.firstName}`, `Confirm your account by clicking this link: ${host}/confirm?code=${player.confirmationCode}`)
    } catch (error) {
        console.log(error)
    }
}

const sendAdminEmail = async (player, data) => {
    try {
        email(process.env.FROM_EMAIL, `Registration Error for ${player.email}`, JSON.stringify(data))
    } catch (error) {
        console.dir(error)
    }
}


module.exports = {
    sendWelcomeEmail,
    sendAdminEmail
}