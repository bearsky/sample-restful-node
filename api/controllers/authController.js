const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(400).json({
                error: {
                    message: 'Invalid credentials'
                }
            });
        }
        const validPassword = await bcryptjs.compare(req.body.password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                error: {
                    message: 'Invalid credentials'
                }
            });
        }
        const token = await jwt.sign({email: user.email, id: user.id}, process.env.JWT_KEY, {expiresIn: '12h'});
        res.status(200).json({
            message: 'Auth successful',
            token: token
        });
    } catch(err) {
        res.status(401).json({
            error: {
                message: 'Auth failed'
            }
        });
    }
};

exports.register = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) {
            res.status(409).json({
                error: {
                    message: 'Email already exists'
                }
            });
        } else if(req.body.password.length < 8) {
            res.status(400).json({
                error: {
                    message: 'Password must contain at least 8 characters'
                }
            });
        }
        const hash = await bcryptjs.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        await newUser.save();
        res.status(201).json({
            message: 'Registration was successful. Now you can login: '
                + req.protocol + '://' + req.get('host') + '/users/login'
        });
    } catch(err) {
        res.status(400).json({
            error: {
                message: err.message
            }
        });
    }
};