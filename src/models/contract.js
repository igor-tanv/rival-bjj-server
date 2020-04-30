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
    method: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    refereeFirstName: {
        type: String,
        required: true
    },
    refereeLastName: {
        type: String,
        required: true
    },
    weightClass: {
        type: String,
        required: true
    },
    opponentRank: {
        gi: {
            type:Number,
            default:0
        },
        nogi: {
            type:Number,
            default:0
        }
    },
    playerRank: {
        gi: {
            type:Number,
            default:0
        },
        nogi: {
            type:Number,
            default:0
        }
    },

},
    {
        timestamps: true
    })

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract