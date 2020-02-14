const express = require('express')
const Contract = require('../models/contract')
const Player = require('../models/player')
const { ensureAuthenticated } = require('../middleware/auth')
const router = new express.Router()


//Match Contract
router.get('/challenge/:opponentId', ensureAuthenticated, async (req, res) => {
    const opponent = await Player.findById(req.params.opponentId)

    if (req.user._id.equals(opponent._id)) {
        req.flash('error', "You can't challenge yourself!")
        return res.redirect('/')
    }
    //console.log(req.user._id, opponent._id)
    res.render('challenge.hbs', { opponent })
})

//Post challenge to the DB
router.post('/challenge', ensureAuthenticated, async (req, res) => {
    try {
        const contract = new Contract({
            rules: req.body.rules,
            datetime: (Date.parse(req.body.datetime)) / 1000,
            school: req.body.school,
            comments: req.body.comments,
            playerId: req.user._id,
            opponentId: req.body.opponentId,
            referee: req.body.referee
        })
        await contract.save()
        req.flash('success_msg', 'Your challenge has been submitted!')
        res.redirect('/')
    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

//Notes: belongsTo and hasMany in Mongoose / virtual fields 
//Render all player contracts 
router.get('/confirmed', ensureAuthenticated, async (req, res) => {

    let contracts = await Promise.all(
        (await Contract.find({ $or: [{ playerId: req.user.id }, { opponentId: req.user.id }] }))
            .map(async (contract) => {
                let opponent;
                if (req.user.id == contract.playerId) {
                    opponent = await Player.findById(contract.opponentId)
                } else {
                    opponent = await Player.findById(contract.playerId)
                }

                date = new Date(contract.datetime * 1000)
                let month = date.getMonth()
                let months = ["", "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                month = months[month]
                let minutes = date.getMinutes()
                if (minutes == 0) {
                    minutes = '00'
                }

                contract['date'] = {
                    "year": date.getFullYear(),
                    month,
                    "day": date.getDate(),
                    "hour": date.getHours(),
                    minutes
                }

                contract['opponent'] = {
                    "avatar": opponent.avatar.toString('base64'),
                    "first": opponent.firstName,
                    "last": opponent.lastName,
                    "school": opponent.school
                }
                console.log(contract)
                return contract
            }))

    res.render('contracts', {
        title: 'Confirmed Upcoming Matches',
        contracts
    })
})

// router.get('/pending', ensureAuthenticated, async (req, res) => {
    
// })


module.exports = router