
const express = require('express')
const AdminService = require('../../services/admin')
const PlayerService = require('../../services/player')

const router = new express.Router()

router.get('/api/admin/contracts/:date', async (req, res, next) => {
  const contracts = await AdminService.getAllContractsByDate(req.params.date)
  res.status(200).json({ contracts })
})


module.exports = router