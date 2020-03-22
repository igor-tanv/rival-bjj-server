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

router.post('/challenge', ensureAuthenticated, async (req, res) => {
    opponentId = req.body.opponentId
    var date = new Date();
    var timestamp = Math.round((date.getTime()) / 1000)
    let matchDate = (Date.parse(req.body.datetime)) / 1000
    let diff = (matchDate - timestamp)
    let threeMonths = 7776000
    if (matchDate) {
        if (timestamp > matchDate) {
            req.flash('error', 'Date of Match cannot be in the past')
            return res.redirect('/challenge/' + opponentId)
        }
        if (diff > threeMonths) {
            req.flash('error', 'Cannot set a match more than 3 months out')
            return res.redirect('/challenge/' + opponentId)
        }
    }
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
router.get('/contracts', ensureAuthenticated, async (req, res) => {
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

                return contract
            }))


    res.render('pending-contracts.hbs', { contracts })
})

router.get('/contracts/:id', ensureAuthenticated, async (req, res) => {
    const _id = req.params.id
    try {
        const contract = await Contract.findOne({ _id, owner: req.player._id })
        if (!contract) {
            return res.status(404).send()
        }
        res.send(contract)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/contracts/:id', ensureAuthenticated, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const contract = await Contract.findOne({ _id: req.params.id, owner: req.player._id })

        if (!contract) {
            return res.status(404).send()
        }

        updates.forEach((update) => contract[update] = req.body[update])
        await contract.save()
        res.send(contract)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/contracts/:id', ensureAuthenticated, async (req, res) => {
    try {
        const contract = await Contract.findOneAndDelete({ _id: req.params.id, owner: req.player._id })

        if (!contract) {
            res.status(404).send()
        }

        res.send(contract)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router