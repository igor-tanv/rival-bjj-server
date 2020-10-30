
const express = require('express')
const paths = require('../../paths')
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../../middleware/auth')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract/index')

const router = new express.Router()

router.post('/api/contracts', async (req, res) => {
  const jsonContract = req.body
  console.dir(req.body)
  const newContract = await ContractService.registerJsonContract(jsonContract)
  res.status(200).json({ newContract })
})

module.exports = router