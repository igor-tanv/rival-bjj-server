const express = require('express')
const router = new express.Router()
const passport = require('passport');
const jwt = require('jsonwebtoken');
const PlayerService = require('../../services/player/index')

router.post('/api/sessions/verify', async (req, res, next) => {
  try {
    jwt.verify(req.body.jwt, process.env.JWT_SECRET);
    res.status(200).json({})
  } catch (error) {
    res.status(401).json({ error })
  }
})

router.post('/api/sessions/reset', async (req, res, next) => {
  try {
    const player = await PlayerService.sendPasswordEmail(req.body)
    if (!player) { res.status(401).json({ error: "No account associated with that email" }) }
    res.status(200).json({})
  } catch (error) {
    res.status(401).json({ error })
  }
})

router.post('/api/sessions/reset/newPassword', async (req, res, next) => {
  const { password, id, token } = req.body
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    await PlayerService.updatePassword(password, id)
    res.status(200).json({})
  } catch (error) {
    res.status(401).json({ error })
  }
})

router.post('/api/sessions', async (req, res, next) => {
  passport.authenticate("local", function (err, player, info) {
    if (err) { return next(err); }
    if (!player) {
      res.status(401).json({ error: "Incorrect email or password" })
      return
    }

    if (!player.confirmedAt) {
      res.status(200).json({ error: `Please check your email (${player.email}) and click the link we sent you` })
      return
    }
    if (player.deletedAt) {
      res.status(200).json({ error: `Your profile has been deleted. Contact the admin if you wish to restore it.` })
      return
    }
    req.logIn(player, function (err) {
      if (err) { return next(err); }

      const token = jwt.sign({
        id: player._id,
        email: player.email
      }, process.env.JWT_SECRET, { expiresIn: '1800s' })

      res.status(200).json({ jwt: token, id: player._id })
    })
  })(req, res, next)
})


router.delete('/api/sessions', async (req, res) => {
  req.logout()
  res.status(200).json({ jwt: null })
})

module.exports = router