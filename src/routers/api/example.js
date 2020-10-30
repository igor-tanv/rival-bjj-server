module.exports = function (router) {
  router.get('/api/example', async (req, res) => {

    res.status(200).json({})

    return router
  })
}