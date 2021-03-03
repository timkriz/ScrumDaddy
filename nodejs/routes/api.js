const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');
var authTools = require('../tools/auth');
const auth = require('../auth/auth');
require('dotenv').config();

const userController = require('../controllers/userController');
const reportsController = require('../controllers/reportsController');


router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to openTravian API crafted with love!',
    });
});
router.route('/register')
    .post(
        passport.authenticate('register', {
            session: false
        }),
        async (req, res, next) => {
            res.json({
                message: 'Registration successful',
                user: req.user
            });
        }
    );

router.route('/login')
    .post(
        async (req, res, next) => {
            passport.authenticate(
                'login',
                async (err, user, info) => {
                    try {
                        if (err || !user) {
                            const error = new Error('An error occurred.');

                            return next(error);
                        }

                        req.login(
                            user, {
                                session: false
                            },
                            async (error) => {
                                if (error) return next(error);

                                const body = {
                                    _id: user._id,
                                    email: user.email,
                                };
                                const token = jwt.sign({
                                    //expiresIn: 60,
                                    user: body
                                }, 'RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*');
                                //res.cookie('capital',token,{maxAge:9000000,httpOnly:true});
                                //res.cookie('jwt',token,{maxAge:9000000,httpOnly:true});
                                return res.json({
                                    token: token,
                                    userId: user._id
                                });
                            }
                        );
                    } catch (error) {
                        return next(error);
                    }
                }
            )(req, res, next);
        }
    );

router.route('/profile')
    .get(passport.authenticate('jwt', {
            session: false
        }),
        (req, res, next) => {
            res.json({
                message: 'You made it to the secure route',
                user: req.user,
                token: req.query.secret_token
            })
        }
    );

router.route('/users')
    .post(userController.new)
    .get(userController.view);
router.route('/users/:id')
    .get(userController.find)
    .patch(userController.update);


router.route('/reports')
    .post(reportsController.new);
router.route('/reports/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, reportsController.view)
router.route('/reports/:idReport')
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, reportsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, reportsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, reportsController.delete);

module.exports = router;

function authenticate(req, res, next){
    passport.authenticate('jwt', {session: false}, function (err, user, info){
        if(user){
            req.user = user;
            return next();
        } else {
            console.log("UNAUTHORIZED - JWT INVALID");
            res.json({
                message:'Unauthorized',
                data:""
            });
            return;
        }
    })(req, res, next)
}