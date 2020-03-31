const express = require('express')
const Contract = require('../models/contract')
const Player = require('../models/player')
const getPlayers = require('../services/player/getPlayers')
const getContracts = require('../services/contract/getContracts')
const registerContract = require('../services/contract/registerContract')
const updateContract = require('../services/contract/updateContract')
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
        return res.redirect('/challenge/' + opponentId)
    }
    req.flash('success_msg', 'Your challenge has been submitted to your opponent for review')
    res.redirect('/')

})

router.get('/contracts/outgoing', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await getContracts.getContracts(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.playerId == req.user.id && contract.status == 'Pending')
    })
    res.render('pending-contracts', { title: 'Pending: Outgoing', contracts })
})

router.get('/contracts/incoming', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await getContracts.getContracts(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.playerId != req.user.id && contract.status == 'Pending')
    })
    res.render('pending-contracts', { title: 'Pending: Incoming', contracts })
})

router.get('/contracts/upcoming', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await getContracts.getContracts(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return contract.status == 'Accepted'
    })
    res.render('pending-contracts', { title: 'All Upcoming Matches', contracts })
})

router.get('/contracts/cancelled-declined', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await getContracts.getContracts(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.status == 'Declined' || contract.status == 'Cancelled')
    })
    res.render('pending-contracts', { title: 'Cancelled / Declined Matches', contracts })
})

router.get('/contract-review/:id', ensureAuthenticated, async (req, res) => {
    let contract = await getContracts.getContract(req.params.id)
    if (contract.status === 200) {
        contract = contract.data
        if (contract.opponentId == req.user.id) {
            let opponent = await getPlayers.getPlayer(contract.playerId)
            contract['opponent'] = opponent
            return res.render('contract-incoming', { contract })
        }
        return res.render('contract-outgoing', { contract })
    }
    req.flash('error', 'Something went wrong')
    return res.redirect('/')
})

router.post('/contract/status/:id', ensureAuthenticated, async (req, res) => {
    let contractId = req.params.id
    let status = req.body
    let updated = await updateContract.updateContractStatus(contractId, status)

    if (updated.status == 200) {
        req.flash('success_msg', 'Match has been ' + updated.data.status)
        return res.redirect('/')
    }
    req.flash('error', updated.data)
    return res.redirect('/')
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