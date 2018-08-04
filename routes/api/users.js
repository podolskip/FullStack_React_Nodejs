const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                errors.email = 'Email already exists!';
                return res.status(400).json(errors);
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
    const { errors, isValid } = validateLoginInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // find user by email
    User.findOne({ email }) // because od the same name (email: email)
        .then((user) => {
            // check if user egsist 
            if (!user) {
                errors.email = 'User not found!';
                return res.status(404).json(errors);
            }

            // check if password is correct

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        // user matched 
                        const payload = {
                            id: user.id,
                            name: user.name,
                        } // Create jwr Payload

                        // sign token
                        const jwtCallback = (err, token) => {
                            return res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        }

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            jwtCallback
                        );
                    } else {
                        errrors.password = 'Password incorect'
                        res.status(400).json(errors)
                    }
                })

        })
});

// @route       GET api/users/current
// @desc        return current user
// @access      Private
const currUserCallback = (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
};

router.get(
    '/current',
    passport.authenticate('jwt',
        { session: false }),
    currUserCallback
)

module.exports = router;