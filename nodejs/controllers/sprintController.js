const path = require('path');
const sprintModel = require('../models/sprintModel');

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

    sprint.name             = req.body.name;
    sprint.description      = req.body.description;
    sprint.startTime        = req.body.startTime;
    sprint.endTime          = req.body.endTime;
    sprint.velocity         = req.body.velocity;
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
        sprint.projectId        = req.params.projectid || sprint.projectId;

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
};