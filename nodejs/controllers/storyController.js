const path = require('path');
const storyModel = require('../models/storyModel');

exports.viewAll = function (req, res) {
    storyModel.find({storySprintId: req.params.sprintid}, function (err, stories) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading stories data..',
            data: stories
        });
    });
};

exports.view = function (req, res) {
    storyModel.findOne({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading story data..',
            data: story
        });
    });
};

// Handle create task actions
exports.new = function (req, res) {
    var story = new storyModel();
    story.storyName = req.body.storyName;
    story.storyTimeEstimate = req.body.storyTimeEstimate;
    story.storyBusinessValue = req.body.storyBusinessValue;
    story.storyComment = req.body.storyComment;
    story.storyPriority = req.body.storyPriority;
    story.storyTests = req.body.storyTests;
    story.storyStatus = req.body.storyStatus;
    story.storyProjectId = req.body.storyProjectId;
    story.storySprintId = req.body.storySprintId;

    story.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'story success',
                data: story
            });
        }
    });
};

exports.update = function (req, res) {
    storyModel.findOne({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        
        story.storyName = req.body.storyName;
        story.storyTimeEstimate = req.body.storyTimeEstimate;
        story.storyBusinessValue = req.body.storyBusinessValue;
        story.storyComment = req.body.storyComment;
        story.storyPriority = req.body.storyPriority;
        story.storyTests = req.body.storyTests;
        story.storyStatus = req.body.storyStatus;
        story.storyProjectId = req.body.storyProjectId;
        story.storySprintId = req.body.storySprintId;

        story.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'story Info updated',
                data: story
            });
        });
    });
};

exports.delete = function (req, res) {
    taskModel.remove({_id: req.params.storyid}, function (err, story) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            status: "success",
            message: 'story deleted'
        });
    });
};