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
    method: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1,
    },
    winner: {
        type: String,
        default: null
    },
    weightClass: {
        type: String,
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    },
    playerFirstName: {
        type: String,
        required: true
    },
    playerLastName: {
        type: String,
        required: true
    },
    playerComments: {
        type: String,
        maxlength: 200
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
    opponentLastName: {
        type: String,
        required: true
    },
    opponentFirstName: {
        type: String,
        required: true
    },
    opponentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
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
    refereeFirstName: {
        type: String,
        required: true
    },
    refereeLastName: {
        type: String,
        required: true
    },
    refereeComments: {
        type: String,
        max: 500
    }
},
    {
        timestamps: true
    })

const Contract = mongoose.model('Contract', contractSchema)

module.exports = Contract