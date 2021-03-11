const path = require('path');
const sprintModel = require('../models/sprintModel');

exports.viewAll = function (req, res) {
    sprintModel.find({sprintProjectId: req.params.projectid}, function (err, sprints) {
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

    sprint.sprintName = req.body.sprintName;
    sprint.sprintDescription = req.body.sprintDescription;
    sprint.sprintStartTime = req.body.sprintStartTime;
    sprint.sprintEndTime = req.body.sprintEndTime;
    sprint.sprintVelocity = req.body.sprintVelocity;
    sprint.sprintProjectId = req.params.projectid;

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
        
        sprint.sprintName = req.body.sprintName || sprint.sprintName;
        sprint.sprintDescription = req.body.sprintDescription || sprint.sprintDescription;
        sprint.sprintStartTime = req.body.sprintStartTime || sprint.sprintStartTime;
        sprint.sprintEndTime = req.body.sprintEndTime || sprint.sprintEndTime;
        sprint.sprintVelocity = req.body.sprintVelocity || sprint.sprintVelocity;
        sprint.sprintProjectId = req.params.projectid || sprint.sprintProjectId;

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