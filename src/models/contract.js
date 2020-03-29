const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    rules: {
        type: String,
        required: true,
    },
    datetime: {
        type: Number,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    comments: {
        type: String,
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
    },
    result: {
        type: String,
        default: 'Pending'
    },
    completed: {
        type: Boolean,
        default: false
    },
    referee: {
        type: String,
        required: true
    },
    weightClass: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract