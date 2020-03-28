const express = require('express')
const Contract = require('../models/contract')
const Player = require('../models/player')
const getPlayers = require('../services/player/getPlayers')
const getContracts = require('../services/contract/getContracts')
const registerContract = require('../services/contract/registerContract')
const { ensureAuthenticated } = require('../middleware/auth')
const router = new express.Router()



router.get('/challenge/:opponentId', ensureAuthenticated, async (req, res) => {
    const opponent = await getPlayers.getPlayer(req.params.opponentId)
    if (req.user._id.equals(opponent._id)) {
        req.flash('error', "You can't challenge yourself!")
        return res.redirect('/')
    }
    res.render('challenge.hbs', { opponent })
})

router.post('/challenge', ensureAuthenticated, async (req, res) => {
    opponentId = req.body.opponentId
    let contract = req.body
    let playerId = req.user.id
    let newContract = await registerContract.registerContract(contract, playerId)
    if (newContract.status != 200) {
        req.flash('error', newContract.data)
        return res.redirect('/challenge/' + opponentId, )
    }
    req.flash('success_msg', 'Your challenge has been submitted!')
    res.redirect('/')

})

//Notes: belongsTo and hasMany in Mongoose / virtual fields 
router.get('/contracts', ensureAuthenticated, async (req, res) => {
    let contracts = await Promise.all(await getContracts.getContracts(req.user.id))
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