const request = require('supertest')
const app = require('../src/app')
const Contract = require('../src/models/contract')
const {
    playerOneId,
    playerOne,
    playerTwoId,
    playerTwo,
    contractOne,
    contractTwo,
    contractThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create contract for player', async () => {
    const response = await request(app)
        .post('/contracts')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const contract = await Contract.findById(response.body._id)
    expect(contract).not.toBeNull()
    expect(contract.completed).toEqual(false)
})

test('Should fetch player contracts', async () => {
    const response = await request(app)
        .get('/contracts')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other players contracts', async () => {
    const response = await request(app)
        .delete(`/contracts/${contractOne._id}`)
        .set('Authorization', `Bearer ${playerTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const contract = await Contract.findById(contractOne._id)
    expect(contract).not.toBeNull()
})
