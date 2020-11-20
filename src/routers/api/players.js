
const express = require('express')
const paths = require('../../paths')
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../../middleware/auth')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract/index')

const router = new express.Router()


router.get('/api/players', async (req, res) => {
  let players = (await PlayerService.getPlayers())//.filter(p => p.confirmedAt != null)
  res.status(200).json({ players })
})

router.get('/api/players/:id', async (req, res) => {
  const player = req.params.id ? await PlayerService.getPlayer(req.params.id) : await PlayerService.getPlayer(req.user.id)
  let contracts = await Promise.all(await ContractService.getMatchHistory(player.id))
  //isNan ensures a rating of 0 does not return Nan
  player.qualityRating = isNaN(((player.sumRating / (player.wins + player.losses + player.draws)) * 10) / 10)
    ? 0 : ((player.sumRating / (player.wins + player.losses + player.draws)) * 10) / 10
  contracts.sort((a, b) => b.datetime - a.datetime)
  res.status(200).json({
    player: {
      ...player._doc,
      qualityRating: player.qualityRating,
      contracts
    }
  })
})

router.post('/api/players', async (req, res) => {
  const response = await PlayerService.create(req.body)
  if (response.status != 200) return res.status(500).json({ ...response.data })

  res.status(200).json({})
})

router.patch('/api/players/:id', async (req, res) => {
  let playerId = req.params.id
  let updates = req.body

  await PlayerService.updatePlayer(playerId, updates)
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