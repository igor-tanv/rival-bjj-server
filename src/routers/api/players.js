
const express = require('express')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract/index')

const router = new express.Router()

router.get('/api/players', async (req, res) => {
  let players = (await PlayerService.getPlayers())
  res.status(200).json({ players })
})

router.get('/api/players/:id', async (req, res) => {
  const player = await PlayerService.getPlayer(req.params.id)
  const contracts = await ContractService.getAllContractsByPlayerId(req.params.id)

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
  const newPlayer = await PlayerService.registerPlayer(req.body)
  if (newPlayer.status != 200) return res.status(500).json({ ...newPlayer.data })
  res.status(200).json({})
})

router.patch('/api/players/:id', async (req, res) => {
  const player = await PlayerService.updatePlayer(req.params.id, req.body)
  if (player.status != 200) return res.status(500).json({ ...newPlayer.data })
  res.status(200).json({})
})

router.delete('/api/players/:id', async (req, res) => {
  try {
    let player = await PlayerService.deletePlayerById(req.params.id)
    if (player.status === 200) res.status(200).json({})
  } catch (e) {
    res.status(500).json({ error: 'Error while deleting profile' })
  }
})

module.exports = router