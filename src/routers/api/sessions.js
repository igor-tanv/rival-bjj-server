const express = require('express')
const router = new express.Router()
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/api/sessions/verify', async (req, res, next) => {
  try {
    const data = jwt.verify(req.body.jwt, process.env.JWT_SECRET);
    res.status(200).json({})
  } catch (error) {
    res.status(401).json({ error: error })
  }

})

router.post('/api/sessions', async (req, res, next) => {
  passport.authenticate("local", function (err, player, info) {

    if (err) { return next(err); }
    if (!player) { res.status(401).json({ error: "Incorrect email or password" }) }
    if (!player.confirmedAt) {
      res.status(200).json({ error: `Please check your email (${player.email}) and click the link we sent you` })
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