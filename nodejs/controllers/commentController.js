const path = require('path');
const commentModel = require('../models/commentModel');

exports.viewAll = function (req, res) {
    commentModel.find({postId: req.params.postid},function (err, comments) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Comments found",
            data: comments
        });
    });
};

exports.view = function (req, res) {
    commentModel.findOne({_id: req.params.commentid}, function (err, comment) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Comment found",
            data: comment
        });
    });
};

exports.new = function (req, res) {
    var comment = new commentModel();

    comment.userId      = req.body.userId;
    comment.timestamp   = req.body.timestamp;
    comment.text        = req.body.text;
    comment.projectId   = req.params.projectid;
    comment.postId      = req.params.postid;

    comment.save(function (err) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Comment created",
            data: comment
        });
    });
};

exports.update = function (req, res) {
    commentModel.findOne({_id: req.params.commentid}, function (err, comment) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }

        comment.userId      = req.body.userId || comment.userId;
        comment.timestamp   = req.body.timestamp || comment.timestamp;
        comment.text        = req.body.text || comment.text;

        comment.save(function (err) {
            if (err) {
                res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
            }
            res.json({
                message: "Comment updated",
                data: comment
            });
        });
    });
};

exports.delete = function (req, res) {
    commentModel.remove({_id: req.params.commentid}, function (err, comment) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Comment removed",
            data: comment
        });
    });
};

exports.deleteMany = function (req, res) {
    commentModel.deleteMany({postId: req.params.postid}, function (err, comments) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Comments deleted",
            data: comments
        });
    });
};