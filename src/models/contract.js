const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    rules: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        reuired: true
    },
    time: {
        type: Number,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 200
    },
    opponentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    }
}, {
    timestamps: true
})

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract