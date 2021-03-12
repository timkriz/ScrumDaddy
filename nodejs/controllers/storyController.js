const path = require('path');
const storyModel = require('../models/storyModel');

exports.viewAll = function (req, res) {
    storyModel.find({sprintId: req.params.sprintid}, function (err, stories) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Stories found",
            data: stories
        });
    });
};

exports.view = function (req, res) {
    storyModel.findOne({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Story found",
            data: story
        });
    });
};

exports.new = function (req, res) {
    var story = new storyModel();

    story.name              = req.body.name;
    story.timeEstimate      = req.body.timeEstimate;
    story.businessValue     = req.body.businessValue;
    story.comment           = req.body.comment;
    story.priority          = req.body.priority;
    story.tests             = req.body.tests;
    story.status            = req.body.status;
    story.projectId         = req.params.projectid;
    story.sprintId          = req.params.sprintid;

    story.save(function (err) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Story created",
            data: story
        });
    });
};

exports.update = function (req, res) {
    storyModel.findOne({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).json(err);
            return;
        }

        story.name              = req.body.name || story.name;
        story.timeEstimate      = req.body.timeEstimate || story.timeEstimate;
        story.businessValue     = req.body.businessValue || story.businessValue;
        story.comment           = req.body.comment || story.comment;
        story.priority          = req.body.priority || story.priority;
        story.tests             = req.body.tests || story.tests;
        story.status            = req.body.status || story.status;
        story.projectId         = req.params.projectid || story.projectId;
        story.sprintId          = req.params.sprintid || story.sprintId;

        story.save(function (err) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json({
                message: "Story updated",
                data: story
            });
        });
    });
};

exports.delete = function (req, res) {
    storyModel.remove({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Story deleted",
            data: story
        });
    });
};

exports.deleteMany = function (req, res) {
    storyModel.deleteMany({projectId: req.params.projectid}, function (err, stories) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Stories deleted",
            data: stories
        });
    });
};