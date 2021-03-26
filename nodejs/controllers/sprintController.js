const path = require('path');
const sprintModel = require('../models/sprintModel');
const storyModel = require('../models/storyModel');
const taskModel = require('../models/taskModel');

exports.viewAll = function (req, res) {
    sprintModel.find({projectId: req.params.projectid}, function (err, sprints) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
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
            res.status(400).json({
                message: err.toString(),
                data: ""});
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

    sprint.name             = req.body.sprintName || req.body.name;
    sprint.description      = req.body.sprintDescription || req.body.description;
    sprint.startTime        = req.body.sprintStartTime || req.body.startTime;
    sprint.endTime          = req.body.sprintEndTime || req.body.endTime;
    sprint.velocity         = req.body.sprintVelocity || req.body.velocity;
    sprint.projectId        = req.params.projectid;

    if(sprint.startTime > sprint.endTime){
        res.status(400).json({
            message: "Start time can not be after end time!",
            data: ""});
        return;
    }

    if(sprint.velocity < 1 || sprint.velocity > 1000){
        res.status(400).json({
            message: "Sprint velocity has to be over 0 and under 1000!",
            data: ""});
        return;
    }

    if(sprint.startTime < Math.round(new Date().getTime() / 1000)){
        res.status(400).json({
            message: "Sprint can not start in the past!",
            data: ""});
        return;
    }

    sprint.save(function (err) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
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
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        
        sprint.name             = req.body.name || sprint.name;
        sprint.description      = req.body.description || sprint.description;
        sprint.startTime        = req.body.startTime || sprint.startTime;
        sprint.endTime          = req.body.endTime || sprint.endTime;
        sprint.velocity         = req.body.velocity || sprint.velocity;

        if(sprint.startTime > sprint.endTime){
            res.status(400).json({
                message: "Start time can not be after end time!",
                data: ""});
            return;
        }
    
        if(sprint.velocity < 1 || sprint.velocity > 1000){
            res.status(400).json({
                message: "Sprint velocity has to be over 0 and under 1000!",
                data: ""});
            return;
        }
    
        if(sprint.startTime < Math.round(new Date().getTime() / 1000)){
            res.status(400).json({
                message: "Sprint can not start in the past!",
                data: ""});
            return;
        }

        sprint.save(function (err) {
            if (err) {
                res.status(400).json({
                message: err.toString(),
                data: ""});
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
            res.status(400).json({
                message: err.toString(),
                data: ""});
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
            res.status(400).json({
                message: err.toString(),
                data: ""});
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