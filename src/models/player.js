const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Contract = require('./contract')

const playerSchema = new mongoose.Schema({
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
    birthDate: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    weight: {
        type: Number,
        required: true,
        trim: true
    },
    school: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    nogi: {
        type: Number,
        required: true,
        trim: true
    },
    gi: {
        type: Number,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

playerSchema.virtual('tasks', {
    ref: 'Contract',
    localField: '_id',
    foreignField: 'owner'
})

playerSchema.methods.toJSON = function () {
    const player = this
    const playerObject = player.toObject()

    delete playerObject.password
    delete playerObject.tokens
    delete playerObject.avatar

    return playerObject
}

// playerSchema.methods.generateAuthToken = async function () {
//     const player = this
//     const token = jwt.sign({ _id: player._id.toString() }, process.env.JWT_SECRET)

//     player.tokens = player.tokens.concat({ token })
//     await player.save()

//     return token
// }

playerSchema.statics.findByCredentials = async (email, password) => {
    const player = await Player.findOne({ email })

    if (!player) {
        throw new Error('Unable to find player')
    }

    const isMatch = await bcrypt.compare(password, player.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return player
}

// Hash the plain text password before saving
playerSchema.pre('save', async function (next) {
    const player = this

    if (player.isModified('password')) {
        player.password = await bcrypt.hash(player.password, 8)
    }

    next()
})

// Delete player contracts when player is removed
playerSchema.pre('remove', async function (next) {
    const player = this
    await Contract.deleteMany({ owner: player._id })
    next()
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player