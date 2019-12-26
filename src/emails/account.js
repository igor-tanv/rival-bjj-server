const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'igor.tanv@gmail.com',
        subject: 'Welcome',
        text: `Welcome to Rival, ${name}. Go find someone and challenge them to a BJJ match.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'igor.tanv@gmail.com',
        subject: 'Goodbye',
        text: `Goodbye, ${name}. We hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}