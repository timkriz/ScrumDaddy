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
const projectsUsersController = require('../controllers/projectsUsersController');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const storyController = require('../controllers/storyController');
const sprintController = require('../controllers/sprintController');

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

router.route('/projectsUsers')
    .post(projectsUsersController.new);
router.route('/projectsUsers/:id')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectsUsersController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectsUsersController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, projectsUsersController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, projectsUsersController.delete);

router.route('/project')
    .post(projectController.new);
router.route('/project/:id')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, projectController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, projectController.delete);

router.route('/task')
    .post(taskController.new);
router.route('/task/:id')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, taskController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, taskController.delete);

router.route('/story')
    .post(storyController.new);
router.route('/story/:id')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, storyController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, storyController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, storyController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, storyController.delete);

router.route('/sprint')
    .post(sprintController.new);
router.route('/sprint/:id')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, sprintController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, sprintController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, sprintController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, sprintController.delete);

module.exports = router;

function authenticate(req, res, next){
    return next(); //TODO
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