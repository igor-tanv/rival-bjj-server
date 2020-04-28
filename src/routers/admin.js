const express = require('express')

const PlayerService = require('../services/player/index')
const ContractService = require('../services/contract/index')
const { ensureAuthenticated } = require('../middleware/auth')
const router = new express.Router()

router.get('/admin', async (req, res) => {
  res.render('admin')
})

router.post('/admin', async (req, res) => {
  let contract = await ContractService.getContractByDate(req.body.datetime)
  res.render('admin', { contract })
})

module.exports = router