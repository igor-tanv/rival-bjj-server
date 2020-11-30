const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
  birthYear: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    unique: "has already been registered, try to log in?",
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  weightClass: {
    type: String,
    required: true,
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
  },
  gi: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  confirmedAt: {
    type: Date,
    default: null,
  },
  confirmationCode: {
    type: String
  }
}, {
  timestamps: true
})

playerSchema.plugin(require('mongoose-beautiful-unique-validation'));

playerSchema.virtual('contracts', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'playerId'
})

playerSchema.virtual("qualityRating").get(() => {
  const score = ((this.sumRating / (this.wins + this.losses + this.draws)) * 10) / 10
  return score || 0
})

playerSchema.methods.toJSON = function () {
  const player = this
  const playerObject = player.toObject()

  delete playerObject.password
  delete playerObject.tokens

  return playerObject
}

playerSchema.statics.confirm = async (confirmationCode) => {
  const player = await Player.findOne({ confirmationCode })
  if (!player) return false
  player.confirmedAt = Date.now()
  await player.save()
  return true
}

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