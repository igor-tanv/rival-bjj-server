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

//do i need ensureAuth here since its verified on the get route
router.post('/challenge', ensureAuthenticated, async (req, res) => {

    try {
        const contract = new Contract({
            rules: req.body.rules,
            datetime: (Date.parse(req.body.datetime)) / 1000,
            school: req.body.school,
            comments: req.body.comments,
            playerId: req.user._id,
            opponentId: req.body.opponentId
        })
        await contract.save()
        req.flash('success_msg', 'Your challenge has been submitted!')
        res.redirect('/')
    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

//WORK HERE
router.get('/contracts', ensureAuthenticated, async (req, res) => {
    const contracts = await Contract.find({
        $or: [{ playerId: req.user.id }, { opponentId: req.user.id }]
    })
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