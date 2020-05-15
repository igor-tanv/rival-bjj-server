const express = require('express')
const passport = require('passport');

const AdminService = require('../services/admin/index')
const PlayerService = require('../services/player/index')
const ContractService = require('../services/contract/index')
const { ensureAuthenticated } = require('../middleware/auth')
const dateTimeHelper = require('../helpers//datetime')

const router = new express.Router()

router.get('/login-admin', async (req, res) => {
  res.render('login-admin.hbs')
})

router.post('/login-admin', async (req, res, next) => {
  passport.authenticate("local", function (err, admin, info) {
    if (err) { return next(err); }
    if (!admin) { return res.render('login-admin', { error: info.message }) }
    if (admin.firstName === 'Igor' && admin.lastName === 'Tatarinov' && admin.birthDate === '1986-07-06') {
      req.logIn(admin, function (err) {
        if (err) { return next(err); }
        return res.render('contracts-admin');
      })
    } else {
      return res.render('login-admin', { error: 'You are not the admin' })
    }
  })(req, res, next)


})

router.post('/admin', async (req, res) => {
  let contracts = await ContractService.getContractByDate(req.body.datetime)
  contracts = await Promise.all(contracts.map(async (contract) => {
    contract['date'] = dateTimeHelper.dateTimeHelper(contract.datetime)
    contract['player'] = await PlayerService.getPlayer(contract.playerId)
    contract['opponent'] = await PlayerService.getPlayer(contract.opponentId)
    return contract
  }))
  res.render('contracts-admin', { contracts })
})

router.post('/result/contract/:contractId', async (req, res) => {
  let contractId = req.params.contractId
  let matchData = req.body
  let response = await AdminService.updatePlayerById(contractId, matchData)
  if (response.status == 200) {
    req.flash('success_msg', response.data)
    res.redirect('/admin')
  } else {
    req.flash('error', response.data)
    res.redirect('/admin')
  }
})

module.exports = router