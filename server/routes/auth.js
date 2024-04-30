const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req, res) => {
    const { userName, email, password } = req.body;
    if (!email || !password || !userName) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({$or:[{email:email},{userName:userName}]}).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or username" })
        }
        bcrypt.hash(password, 12).then(hashedpassword => {
            const user = new User({
                userName,
                email,
                password: hashedpassword,
            })
            user.save().then(user => {
                res.json({ message: "Saved successfully" })
            }).catch(err => {
                console.log(err)})
        })
    })
})


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" })
    }
    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password" })
        }
        bcrypt.compare(password, savedUser.password).then(doMatch => {
            if (doMatch) {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, userName, email } = savedUser
                res.json({ token, user: { _id, userName, email } })
            } else {
                return res.status(422).json({ error: "Invalid email or password" })
            }
        }).catch(err => {
            console.log(err)
        })
    })
})

module.exports = router;