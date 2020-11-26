
const express = require('express')
const paths = require('../../paths')
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../../middleware/auth')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract/index')

const router = new express.Router()

router.get('/api/players', async (req, res) => {
  let players = (await PlayerService.getPlayers()).filter(p => p.confirmedAt != null && p.deletedAt === null)
  res.status(200).json({ players })
})

router.get('/api/players/:id', async (req, res) => {
  const player = await PlayerService.getPlayer(req.params.id)
  const contracts = await ContractService.getAllContractsByPlayerId(req.params.id)
  console.log(contracts)

  res.status(200).json({
    player: {
      ...player._doc,
      qualityRating: player.qualityRating,
      contracts: contracts
        ? contracts.sort((a, b) => b.datetime - a.datetime)
        : []
    }
  })
})

router.post('/api/players', async (req, res) => {
  const response = await PlayerService.registerPlayer(req.body)
  console.log(36, response)
  if (response.status != 200) return res.status(500).json({ ...response.data })
  res.status(200).json({})
})


router.patch('/api/players/:id', async (req, res) => {
  await PlayerService.updatePlayer(req.params.id, req.body)
  res.status(200).json({ success: 'Your profile has been updated' })
})

router.delete('/api/players/:id', async (req, res) => {
  try {
    let player = await PlayerService.deletePlayerById(req.params.id)
    fs.unlink(paths.PUBLIC.AVATAR_PICTURES + '/' + player.data.avatar, function (err) {
      if (err) throw err
    })
    if (player.status === 200) res.status(200).json({ success_msg: 'Your account has been deleted' })
  } catch (e) {
    res.status(400).json({ error: 'Error while deleting profile' })
  }
})

module.exports = router