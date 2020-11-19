const express = require('express')
const router = new express.Router()
const Player = require("../../models/player")

router.post('/api/confirmations', async (req, res) => {
  const success = await Player.confirm(req.body.code)
  const data = !success ? ({ errors: { code: "invalid code" } }) : ({})
  res.status(201).json(data)
})

module.exports = router