const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Player = require('../models/player')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()


router.get('/', async (req, res) => {

    res.render('main', {
        title: 'Welcome to Rival',
        name: 'Igor Tatarinov'
    })
    
})

router.get('/about', async (req, res) => {

    res.render('about', {
        title: 'About Rival',
        name: 'Igor Tatarinov'
    })
})

router.get('/challenge', async (req, res) => {

    res.render('challenge', {
        title: 'The Match Contract'
    })

})

router.get('/rankings', async (req, res) => {
    Player.find(function(err, rank) {
        //sorts by nogiRank from high to low
        rank.sort((a,b) => b.nogi - a.nogi)
        res.render('rankings', { rankings: rank });
    });

})


router.get('/register', async (req, res) => {

    res.render('register', {
        title: 'Register Your BJJ Profile',
        name: 'Igor Tatarinov'
    })

})


router.post('/sign_up', async (req, res) => {
    
    const player = new Player(req.body)
    console.log(player)
    
    try {
        await player.save()
        //sendWelcomeEmail(player.email, player.name)
        const token = await player.generateAuthToken()
        //res.status(201).send({ player, token })
        res.render('signup_success', {
            title: 'Welcome Aboard'
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/login', async (req, res) => {

    res.render('login', {
        title: 'Login to Your Profile'
    })

})

router.post('/auth', async (req, res) => {
    try {
        const player = await Player.findByCredentials(req.body.email, req.body.password)
        const token = await player.generateAuthToken()
        res.send({ player, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/players/logout', auth, async (req, res) => {
    try {
        req.player.tokens = req.player.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.player.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/players/logoutAll', auth, async (req, res) => {
    try {
        req.player.tokens = []
        await req.player.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/players/me', auth, async (req, res) => {
    res.send(req.player)
})

router.patch('/players/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.player[update] = req.body[update])
        await req.player.save()
        res.send(req.player)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/players/me', auth, async (req, res) => {
    try {
        await req.player.remove()
        sendCancelationEmail(req.player.email, req.player.name)
        res.send(req.player)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/players/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.player.avatar = buffer
    await req.player.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/players/me/avatar', auth, async (req, res) => {
    req.player.avatar = undefined
    await req.player.save()
    res.send()
})

router.get('/players/:id/avatar', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)

        if (!player || !player.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(player.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router