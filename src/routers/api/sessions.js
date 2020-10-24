const express = require('express')
const router = new express.Router()
const passport = require('passport');
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

router.post('/api/sessions', async (req, res, next) => {


  passport.authenticate("local", function (err, player, info) {

    if (err) { return next(err); }
    if (!player) { res.status(401).json({ error: "Your email of password was icky" }) }
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
  // destroy jwt
  res.status(200).json({ jwt })
})

module.exports = router