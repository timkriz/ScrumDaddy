const path = require('path');
const storyModel = require('../models/storyModel');

exports.viewAll = function (req, res) {
    storyModel.find({storySprintId: req.params.sprintid}, function (err, stories) {
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

    story.storyName = req.body.storyName;
    story.storyTimeEstimate = req.body.storyTimeEstimate;
    story.storyBusinessValue = req.body.storyBusinessValue;
    story.storyComment = req.body.storyComment;
    story.storyPriority = req.body.storyPriority;
    story.storyTests = req.body.storyTests;
    story.storyStatus = req.body.storyStatus;
    story.storyProjectId = req.params.projectid;
    story.storySprintId = req.params.sprintid;

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

        story.storyName = req.body.storyName || story.storyName;
        story.storyTimeEstimate = req.body.storyTimeEstimate || story.storyTimeEstimate;
        story.storyBusinessValue = req.body.storyBusinessValue || story.storyBusinessValue;
        story.storyComment = req.body.storyComment || story.storyComment;
        story.storyPriority = req.body.storyPriority || story.storyPriority;
        story.storyTests = req.body.storyTests || story.storyTests;
        story.storyStatus = req.body.storyStatus || story.storyStatus;
        story.storyProjectId = req.params.projectid || story.storyProjectId;
        story.storySprintId = req.params.sprintid || story.storySprintId;

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
    taskModel.remove({_id: req.params.storyid}, function (err, story) {
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