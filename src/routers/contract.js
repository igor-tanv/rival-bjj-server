const express = require('express')
const Contract = require('../models/contract')
//const auth = require('../middleware/auth')
const { ensureAuthenticated } = require('../middleware/auth')
const router = new express.Router()

router.post('/contracts', ensureAuthenticated, async (req, res) => {
    const contract = new Contract({
        ...req.body,
        owner: req.player._id
    })

    try {
        await contract.save()
        res.status(201).send(contract)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /contracts?completed=true
// GET /contracts?limit=10&skip=20
// GET /contracts?sortBy=createdAt:desc
router.get('/contracts', ensureAuthenticated, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.player.populate({
            path: 'contracts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.player.contracts)
    } catch (e) {
        res.status(500).send()
    }
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
        const contract = await Contract.findOne({ _id: req.params.id, owner: req.player._id})

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