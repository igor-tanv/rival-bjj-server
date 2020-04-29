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
  let contractId = req.params.contractId
  let matchData = req.body

  //console.log('API', contractId, matchData)

  tempVariable = await AdminService.updatePlayerRanksById(contractId, matchData)
  
})

module.exports = router