const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {User} = require('../models/user')


router.get(`/`, async(req, res) => {
    const userList = await User.find().select('-passwordHash')

    if(!userList){
        res.status(500).json({success: false})
    }

    res.send(userList)
})

router.get(`/:id`, (req, res) => {
    const user = User.findById(req.params.id).select('-passwordHash')
    .then((user) => res.send(user))
    .catch(e => res.status(404).send({error: e}))
})

router.post(`/`, (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    user = user.save()
    .then((user) => {
        return res.send(user)
    })
    .catch(e => res.status(500).send({error: e}))
})

router.post(`/login`, (req, res) => {
    const secret = process.env.json_secret
    const user = User.findOne({email: req.body.email})
    .then((user) => {
        if(user == null){
            res.status(400).send('User not Found')
        }
        else if(bcrypt.compareSync(req.body.password, user.passwordHash)){
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret
            )
            res.send({user: user.email, token: token})
        }
        else{
            res.status(401).send('Incorrect Credentials')
        }
    }
    )
    .catch(() => res.status(400).send({error: 'Check required fields'}))
})

router.post(`/register`, (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        // isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    user = user.save()
    .then((user) => {
        return res.send(user)
    })
    .catch(e => res.status(500).send({error: e}))
})

router.delete(`/:id`, (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(user){
            return res.status(200).json({success: true, message: `${user.name} has been deleted`})
        }
        else{
            return res.status(404).json({success: false, message: 'product not found'})
        }
    })
    .catch((e) => {
        return res.status(500).json({success: false, error: e})
    })
})

router.get(`/get/count`, async(req, res) => {
    try{
        const userCount = await User.countDocuments({})

        if(!userCount){
            res.status(500).json({success: "false"})
        }
        res.status(202).send({
            count: userCount
        })
    }
    catch(e){
        res.status(404).send(e.name == 'CastError' ? 'Product not found' : e)
    }
})

module.exports = router