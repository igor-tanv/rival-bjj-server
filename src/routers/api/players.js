// players/ GET INDEX/SEARCH
// players/1 GET SHOW
// players/ POST CREATE
// players/1 PATCH UPDATE
// players/1 DELETE DELETE

const express = require('express')
const paths = require('../../paths')
const passport = require('passport');
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../../middleware/auth')
const PlayerService = require('../../services/player/index')
const ContractService = require('../../services/contract/index')

const router = new express.Router()

router.use("/avatar-pictures", express.static(paths.PUBLIC.AVATAR_PICTURES))
router.use("/css", express.static(paths.PUBLIC.CSS))


router.get('/players.json', async (req, res) => {
  let players = await PlayerService.getPlayers()
  players.sort((a, b) => b.nogi - a.nogi)
  res.status(200).json({ players })
})

// currently this is for the player profile page which needs the player contract info as well 
router.get('/player/:id', async (req, res) => {
  let player = req.params.id === ':id' ? await PlayerService.getPlayer(req.user.id) : await PlayerService.getPlayer(req.params.id)
  let contracts = await Promise.all(await ContractService.getMatchHistory(player.id))
  //isNan ensures a rating of 0 does not return Nan
  player.averageRating = isNaN(((player.sumRating / (player.wins + player.losses + player.draws)) * 10) / 10)
    ? 0 : ((player.sumRating / (player.wins + player.losses + player.draws)) * 10) / 10
  contracts.sort((a, b) => b.datetime - a.datetime)
  res.status(200).json({ player, contracts })
})

router.post('/player.json', async (req, res) => {
  const registerData = await PlayerService.registerPlayerJson(req.body)
  if (registerData.status != 200) return res.status(400).json({ error: registerData.data })
  let player = registerData.data
  //factor out this code and the same in the post login
  req.logIn(player, function (err) {
    if (err) return next(err)
    return res.status(200).json({ player })
  })
})

router.patch('/player', multipart({ uploadDir: paths.PUBLIC.AVATAR_PICTURES, maxFieldsSize: 10 * 1024 * 1024 }),
  async (req, res) => {
    let playerId = req.user.id
    let updates = req.body
    let newavatar = req.files.avatar
    await PlayerService.updatePlayer(playerId, updates, newavatar)
    res.status(200).json({ success: 'Your profile has been updated', player: updates })
  })

router.delete('/player/:id', async (req, res) => {
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