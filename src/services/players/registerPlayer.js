const Player = require('../../models/player')

module.exports = async (req, res) => {
  const player = new Player(req.body)
  const file = req.files.file

  if (file) {
    //console.log(5, req.files.file)
    const arrFile = req.files.file.path.split('/')
    player.avatar = arrFile[arrFile.length - 1]
  }
  console.log('SERVICE LEVEL',player)
  await player.save()
  return res.json({ status: 200, data: player })
}
