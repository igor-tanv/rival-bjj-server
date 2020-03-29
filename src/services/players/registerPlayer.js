const Player = require('../../models/player')

module.exports = async (req, res) => {

  try {
    player = new Player(req.body)
    if (req.files.file) {
      const arrFile = req.files.file.path.split('/')
      player.avatar = arrFile[arrFile.length - 1]
    }
    await player.save()
    return res.json({ status: 200, data: player })
  } 
  catch (err) {
    console.log('ERROR',err)
    return res.json({ status: 400, data: err })
  }
}
