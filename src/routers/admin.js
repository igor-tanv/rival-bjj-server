const express = require('express')

const AdminService = require('../services/admin/index')
const PlayerService = require('../services/player/index')
const ContractService = require('../services/contract/index')
const { ensureAuthenticated } = require('../middleware/auth')
const dateTimeHelper = require('../helpers//datetime')

const router = new express.Router()

router.get('/admin', async (req, res) => {
  res.render('admin-contracts')
})

router.post('/admin', async (req, res) => {
  let contracts = await ContractService.getContractByDate(req.body.datetime)
  contracts = await Promise.all(contracts.map(async (contract) => {
      contract['date'] = dateTimeHelper.dateTimeHelper(contract.datetime)
      contract['player'] = await PlayerService.getPlayer(contract.playerId)
      contract['opponent'] = await PlayerService.getPlayer(contract.opponentId)
      return contract
    }))
  res.render('admin-contracts', { contracts })
})

router.post('/result/contract/:contractId', async (req, res) => {
  console.log(req.body)
  let contractId = req.params.contractId
  let matchData = req.body
  let response = await AdminService.updatePlayerRanksById(contractId, matchData)
  if (response.status == 200) {
    req.flash('success_msg', response.data)
    res.redirect('/admin')
  } else {
    req.flash('error', response.data)
    res.redirect('/admin')
  }
})

module.exports = router