const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    matchRules: {
        type: String,
        required: true,
        trim: true
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