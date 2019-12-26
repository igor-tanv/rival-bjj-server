const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    }
}, {
    timestamps: true
})

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract