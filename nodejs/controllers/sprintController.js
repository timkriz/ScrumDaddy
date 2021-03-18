const path = require('path');
const sprintModel = require('../models/sprintModel');
const storyModel = require('../models/storyModel');
const taskModel = require('../models/taskModel');

exports.viewAll = function (req, res) {
    sprintModel.find({projectId: req.params.projectid}, function (err, sprints) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Sprints found",
            data: sprints
        });
    });
};

exports.view = function (req, res) {
    sprintModel.findOne({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Sprint found",
            data: sprint
        });
    });
};

exports.new = function (req, res) {
    var sprint = new sprintModel();

    sprint.name             = req.body.sprintName;
    sprint.description      = req.body.sprintDescription;
    sprint.startTime        = req.body.sprintStartTime;
    sprint.endTime          = req.body.sprintEndTime;
    sprint.velocity         = req.body.sprintVelocity;
    sprint.projectId        = req.params.projectid;

    sprint.save(function (err) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Sprint created",
            data: sprint
        });
    });
};

exports.update = function (req, res) {
    sprintModel.findOne({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        
        sprint.name             = req.body.name || sprint.name;
        sprint.description      = req.body.description || sprint.description;
        sprint.startTime        = req.body.startTime || sprint.startTime;
        sprint.endTime          = req.body.endTime || sprint.endTime;
        sprint.velocity         = req.body.velocity || sprint.velocity;

        sprint.save(function (err) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json({
                message: "Sprint updated",
                data: sprint
            });
        });
    });
};

exports.delete = function (req, res) {
    sprintModel.remove({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Sprint deleted",
            data: sprint
        });
    });
    storyModel.deleteMany({sprintId: req.params.sprintid}, function (err, stories) {});
    taskModel.deleteMany({sprintId: req.params.sprintid}, function (err, tasks) {});
};

exports.deleteMany = function (req, res) {
    sprintModel.deleteMany({projectId: req.params.projectid}, function (err, stories) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Stories deleted",
            data: stories
        });
    });
    storyModel.deleteMany({projectId: req.params.projectid}, function (err, stories) {});
    taskModel.deleteMany({projectId: req.params.projectid}, function (err, tasks) {});
};