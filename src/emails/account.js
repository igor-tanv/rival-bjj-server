const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const host = process.env.CLIENT
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

const sendPasswordResetEmail = async (player) => {
    try {
        email(player.email, `Password reset for: ${player.firstName}`, `Click on this link to reset your password:`)
    } catch (error) {
        console.log(error)
    }
}

const sendAcceptContractEmail = async (player, contract) => {
    try {
        email(player.email, `Your match has been accepted!`, `${contract.opponentFirstName} ${contract.opponentLastName} has accepted your match. To see the contract details go to your Profile, My Contracts, Accepted to see the full details`)
    } catch (error) {
        console.log(error)
    }
}

const sendDeclineContractEmail = async (player, contract) => {
    try {
        email(player.email, `Your match has been declined`, `${contract.opponentFirstName} ${contract.opponentLastName} has declined your match. Go to your Profile, My Contracts, Declined to see the full details`)
    } catch (error) {
        console.log(error)
    }
}

const sendIssueContractEmail = async (opponent, contract) => {
    try {
        email(opponent.email, `You've been challenged you to a match!`, `${contract.playerFirstName} ${contract.playerLastName} has challenged you to a match. Go to your Profile, My Contracts, Received to see the full details. You can either accept or decline the match`)
    } catch (error) {
        console.log(error)
    }
}

const sendCancelContractEmail = async (player, cancelledBy) => {
    try {
        email(player.email, `Your match has been cancelled`, `${cancelledBy.firstName} ${cancelledBy.LastName} has cancelled your upcoming match. Go to your Profile, My Contracts, Cancelled to see the full details`)
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
    sendAdminEmail,
    sendPasswordResetEmail,
    sendAcceptContractEmail,
    sendIssueContractEmail,
    sendDeclineContractEmail,
    sendCancelContractEmail

}