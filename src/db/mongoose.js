const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, err => {
    if (err) {
        console.error('Failed to connect to the database.')
        throw err
    }
    process.emit("database:ready")
})