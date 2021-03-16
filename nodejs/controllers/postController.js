const path = require('path');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');

exports.viewAll = function (req, res) {
    postModel.find(function (err, posts) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Posts found",
            data: posts
        });
    });
};

exports.view = function (req, res) {
    postModel.findOne({_id: req.params.postid}, function (err, post) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Post found",
            data: post
        });
    });
};

exports.new = function (req, res) {
    var post = new postModel();

    post.userId         = req.body.userId;
    post.timestamp      = req.body.timestamp;
    post.text           = req.body.text;
    post.projectId      = req.params.projectid;

    post.save(function (err) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Post created",
            data: post
        });
    });
};

exports.update = function (req, res) {
    postModel.findOne({_id: req.params.postid}, function (err, post) {
        if (err) {
            res.status(400).json(err);
            return;
        }

        post.userId         = req.body.userId || post.userId;
        post.timestamp      = req.body.timestamp || post.timestamp;
        post.text           = req.body.text || post.text;

        post.save(function (err) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json({
                message: "Post updated",
                data: post
            });
        });
    });
};

exports.delete = function (req, res) {
    postModel.remove({_id: req.params.postid}, function (err, post) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Post removed",
            data: post
        });
    });
    commentModel.deleteMany({postId: req.params.postid}, function (err, comments) {});
};

exports.deleteMany = function (req, res) {
    postModel.deleteMany({projectId: req.params.projectid}, function (err, posts) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Posts deleted",
            data: posts
        });
    });
    commentModel.deleteMany({projectId: req.params.projectid}, function (err, comments) {});
};