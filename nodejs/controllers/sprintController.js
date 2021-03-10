const path = require('path');
const sprintModel = require('../models/sprintModel');

exports.viewAll = function (req, res) {
    sprintModel.find({sprintProjectId: req.params.projectid}, function (err, sprints) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading sprints data..',
            data: sprints
        });
    });
};

exports.view = function (req, res) {
    sprintModel.findOne({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading sprint data..',
            data: sprint
        });
    });
};

// Handle create task actions
exports.new = function (req, res) {
    var sprint = new sprintModel();
    sprint.sprintName = req.body.sprintName;
    sprint.sprintDescription = req.body.sprintDescription;
    sprint.sprintStartTime = req.body.sprintStartTime;
    sprint.sprintEndTime = req.body.sprintEndTime;
    sprint.sprintVelocity = req.body.sprintVelocity;
    sprint.sprintProjectId = req.body.sprintProjectId;

    sprint.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'sprint success',
                data: sprint
            });
        }
    });
};

exports.update = function (req, res) {
    sprintModel.findOne({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        
        sprint.sprintName = req.body.sprintName;
        sprint.sprintDescription = req.body.sprintDescription;
        sprint.sprintStartTime = req.body.sprintStartTime;
        sprint.sprintEndTime = req.body.sprintEndTime;
        sprint.sprintVelocity = req.body.sprintVelocity;
        sprint.sprintProjectId = req.body.sprintProjectId;

        sprint.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'sprint Info updated',
                data: sprint
            });
        });
    });
};

exports.delete = function (req, res) {
    sprintModel.remove({_id: req.params.sprintid}, function (err, sprint) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            status: "success",
            message: 'sprint deleted'
        });
    });
};