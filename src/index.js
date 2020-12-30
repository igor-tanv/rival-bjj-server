const app = require('./app')
const port = process.env.PORT


app.httpServer.listen(port, err => {
    if (err) {
        throw err;
    }
    console.log('Server is up on port ' + port)
})