const express = require('express')
const router = new express.Router()


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

router.post('/api/sessions', async (req, res) => {
  // create jwt
  debugger
  const jwt = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
  res.status(200).json({ jwt })
})


router.delete('/api/sessions', async (req, res) => {
  // destroy jwt
  res.status(200).json({ jwt })
})