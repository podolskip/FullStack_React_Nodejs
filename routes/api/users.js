const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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

module.exports = router;