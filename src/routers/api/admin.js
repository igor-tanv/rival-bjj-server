
const express = require('express')
const ContractService = require('../../services/contract')
const Contract = require('../../models/contract')

const router = new express.Router()

router.use('/api/admin/*', (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error("Forbidden.")
    err.statusCode = 403
    return next(err)
  }
  next()
})


router.get('/api/admin/contract', async (req, res) => {
  const contracts = await ContractService.getAllContractsByPlayerId(req.query.playerId)
  res.status(200).json({ contracts })
})

module.exports = router