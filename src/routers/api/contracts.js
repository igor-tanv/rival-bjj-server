
const express = require('express')
const paths = require('../../paths')
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../../middleware/auth')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract')
const Contract = require('../../models/contract')

const router = new express.Router()

router.get('/api/contracts', async (req, res) => {
  const contracts = await ContractService.getAllByPlayerId(req.query.playerId)
  console.dir(contracts)
  res.status(200).json({ contracts })
})

router.post('/api/contracts', async (req, res) => {
  try {
    const contract = await ContractService.create(req.body)
    res.status(201).json({ contract })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.post('/api/contracts/:id/accept', async (req, res) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { _id: req.params.id },
      { acceptedAt: new Date() },
      { new: true })

    res.status(201).json({ contract })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.post('/api/contracts/:id/decline', async (req, res) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { _id: req.params.id },
      { declinedAt: new Date() },
      { new: true })

    res.status(201).json({ contract })
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router