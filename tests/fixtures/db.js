const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Player = require('../../src/models/player')
const Contract = require('../../src/models/contract')

const playerOneId = new mongoose.Types.ObjectId()
const playerOne = {
    _id: playerOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: playerOneId }, process.env.JWT_SECRET)
    }]
}

const playerTwoId = new mongoose.Types.ObjectId()
const playerTwo = {
    _id: playerTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: playerTwoId }, process.env.JWT_SECRET)
    }]
}

const contractOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First contract',
    completed: false,
    owner: playerOne._id
}

const contractTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second contract',
    completed: true,
    owner: playerOne._id
}

const contractThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third contract',
    completed: true,
    owner: playerTwo._id
}

const setupDatabase = async () => {
    await Player.deleteMany()
    await Contract.deleteMany()
    await new Player(playerOne).save()
    await new Player(playerTwo).save()
    await new Contract(contractOne).save()
    await new Contract(contractTwo).save()
    await new Contract(contractThree).save()
}

module.exports = {
    playerOneId,
    playerOne,
    playerTwoId,
    playerTwo,
    contractOne,
    contractTwo,
    contractThree,
    setupDatabase
}