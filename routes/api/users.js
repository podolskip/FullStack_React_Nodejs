const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load user model 
const User = require('../../models/User');

// @route       GET api/users/test
// @desc        Test users route
// @access      Public

router.get('/test', (req, res) => {
    return res.json({
        msg: 'users works'
    });
});

// @route       GET api/users/register
// @desc        Register user
// @access      Public

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: 'Email already exists!' })
            } else {
                const avatar = 'aaa';
                // gravatar.url(req.body.email, {
                //     s: '200', // size
                //     r: 'pg', // rating
                //     d: 'mm' // default
                // });


                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then((user) => {
                                return res.json(user);
                            })
                            .catch(err => console.log(err));
                    })
                })
            }
        });
})

// @route       GET api/users/login
// @desc        Login User / retuening JWT token
// @access      Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({ email }) // because od the same name (email: email)
        .then((user) => {
            // check if user egsist 
            if (!user) {
                return res.status(404).json({ email: 'User not found!' });
            }

            // check if password is correct

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        // // user matched 
                        // const payload = {
                        //     id: user.id,
                        //     name: user.name,
                        //     } // Create jwr Payload

                        // // sign token
                        // jwt.sign(payload);
                        res.json({ msg: 'Success' })
                    } else {
                        res.status(400).json({ password: 'Password incorrect' })
                    }
                })

        })
});

module.exports = router;