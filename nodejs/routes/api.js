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
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

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
                                    userId: user._id,
                                    userRole: user.role
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
    .put(userController.update)
    .patch(userController.update)
    .delete(userController.delete);

router.route('/projects')
    .post(projectController.new)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectController.viewAll);
router.route('/projects/:projectid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, projectController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, projectController.delete);

router.route('/projects/:projectid/users')
    .post(projectsUsersController.new)
    .get(projectsUsersController.viewAll)
    .delete(projectsUsersController.deleteMany);
router.route('/projects/:projectid/users/:userid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectsUsersController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, projectsUsersController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, projectsUsersController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, projectsUsersController.delete);

router.route('/projects/:projectid/posts')
    .post(postController.new)
    .get(postController.viewAll)
    .delete(postController.deleteMany);
router.route('/projects/:projectid/posts/:postid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, postController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, postController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, postController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, postController.delete);

router.route('/projects/:projectid/posts/:postid/comments')
    .post(commentController.new)
    .get(commentController.viewAll)
    .delete(commentController.deleteMany);
    //.get((req,res,next)     => authenticate(req,res,next), authTools.checkId, commentController.viewAll)
    //.delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, commentController.deleteMany);
router.route('/projects/:projectid/posts/:postid/comments/:commentid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, commentController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, commentController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, commentController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, commentController.delete);

router.route('/projects/:projectid/sprints')
    .post(sprintController.new)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, sprintController.viewAll);
router.route('/projects/:projectid/sprints/:sprintid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, sprintController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, sprintController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, sprintController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, sprintController.delete);

router.route('/projects/:projectid/sprints/:sprintid/stories')
    .post(storyController.new)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, storyController.viewAll);
router.route('/projects/:projectid/sprints/:sprintid/stories/:storyid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, storyController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, storyController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, storyController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, storyController.delete);

router.route('/projects/:projectid/sprints/:sprintid/stories/:storyid/tasks')
    .post(taskController.new)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskController.viewAll);
router.route('/projects/:projectid/sprints/:sprintid/stories/:storyid/tasks/:taskid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, taskController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, taskController.delete);



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