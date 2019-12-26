const request = require('supertest')
const app = require('../src/app')
const Player = require('../src/models/player')
const { playerOneId, playerOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new player', async () => {
    const response = await request(app).post('/players').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const player = await Player.findById(response.body.player._id)
    expect(player).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        player: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: player.tokens[0].token
    })
    expect(player.password).not.toBe('MyPass777!')
})

test('Should login existing player', async () => {
    const response = await request(app).post('/players/login').send({
        email: playerOne.email,
        password: playerOne.password
    }).expect(200)
    const player = await Player.findById(playerOneId)
    expect(response.body.token).toBe(player.tokens[1].token)
})

test('Should not login nonexistent player', async () => {
    await request(app).post('/players/login').send({
        email: playerOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('Should get profile for player', async () => {
    await request(app)
        .get('/players/me')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated player', async () => {
    await request(app)
        .get('/players/me')
        .send()
        .expect(401)
})

test('Should delete account for player', async () => {
    await request(app)
        .delete('/players/me')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send()
        .expect(200)
    const player = await Player.findById(playerOneId)
    expect(player).toBeNull()
})

test('Should not delete account for unauthenticate player', async () => {
    await request(app)
        .delete('/players/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/players/me/avatar')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const player = await Player.findById(playerOneId)
    expect(player.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid player fields', async () => {
    await request(app)
        .patch('/players/me')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const player = await Player.findById(playerOneId)
    expect(player.name).toEqual('Jess')
})

test('Should not update invalid player fields', async () => {
    await request(app)
        .patch('/players/me')
        .set('Authorization', `Bearer ${playerOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})