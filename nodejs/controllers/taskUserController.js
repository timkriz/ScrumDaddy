const path = require('path');
const taskUserModel = require('../models/taskUserModel');

exports.viewAll = function (req, res) {
    taskUserModel.find({taskId: req.params.taskid}, function (err, taskUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "TaskUsers found",
            data: taskUsers
        });
    });
};

exports.view = function (req, res) {
    taskUserModel.findOne({_id: req.params.taskuserid}, function (err, taskUser) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "TaskUser found",
            data: taskUser
        });
    });
};

exports.new = function (req, res) {
    var taskUser = new taskUserModel();

    taskUser.userId             = req.body.userId;
    taskUser.timestamp          = req.body.timestamp;
    taskUser.timeLog            = req.body.timeLog;
    taskUser.timeRemaining      = req.body.timeRemaining;
    taskUser.projectId          = req.params.projectid;
    taskUser.sprintId           = req.params.sprintid;
    taskUser.storyId            = req.params.storyid;
    taskUser.userId             = req.params.taskid;

    taskUser.save(function (err) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "TaskUser created",
            data: taskUser
        });
    });
};

exports.update = function (req, res) {
    taskUserModel.findOne({_id: req.params.taskuserid}, function (err, taskUser) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }

        
        taskUser.userId             = req.body.userId || taskUser.userId;
        taskUser.timestamp          = req.body.timestamp || taskUser.timestamp;
        taskUser.timeLog            = req.body.timeLog || taskUser.timeLog;
        taskUser.timeRemaining      = req.body.timeRemaining || taskUser.timeRemaining;

        taskUser.save(function (err) {
            if (err) {
                res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
            }
            res.json({
                message: "TaskUser updated",
                data: taskUser
            });
        });
    });
};

exports.delete = function (req, res) {
    taskUserModel.remove({_id: req.params.taskuserid}, function (err, taskUser) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "TaskUser deleted",
            data: taskUser
        });
    });
};

exports.deleteMany = function (req, res) {
    taskUserModel.deleteMany({storyId: req.params.taskid}, function (err, taskUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "TaskUsers deleted",
            data: taskUsers
        });
    });
};