const path = require('path');
const taskModel = require('../models/taskModel');

exports.viewAll = function (req, res) {
    taskModel.find({storyId: req.params.storyid}, function (err, tasks) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Tasks found",
            data: tasks
        });
    });
};

exports.view = function (req, res) {
    taskModel.findOne({_id: req.params.taskid}, function (err, task) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Task found",
            data: task
        });
    });
};

exports.new = function (req, res) {
    var task = new taskModel();

    task.name               = req.body.name;
    task.description        = req.body.description;
    task.timeEstimate       = req.body.timeEstimate;
    task.suggestedUser      = req.body.suggestedUser;
    task.assignedUser       = req.body.assignedUser;
    task.status             = req.body.status;
    task.projectId          = req.params.projectid;
    task.sprintId           = req.params.sprintid;
    task.storyId            = req.params.storyid;

    task.save(function (err) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Task created",
            data: task
        });
    });
};

exports.update = function (req, res) {
    taskModel.findOne({_id: req.params.taskid}, function (err, task) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        
        task.name               = req.body.name || task.name;
        task.description        = req.body.description || task.description;
        task.timeEstimate       = req.body.timeEstimate || task.timeEstimate;
        task.suggestedUser      = req.body.suggestedUser || task.suggestedUser;
        task.assignedUser       = req.body.assignedUser || task.assignedUser;
        task.status             = req.body.status || task.status;

        task.save(function (err) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json({
                message: "Task updated",
                data: task
            });
        });
    });
};

exports.delete = function (req, res) {
    taskModel.remove({_id: req.params.taskid}, function (err, task) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Task deleted",
            data: task
        });
    });
};

exports.deleteMany = function (req, res) {
    taskModel.deleteMany({storyId: req.params.storyid}, function (err, tasks) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Tasks deleted",
            data: tasks
        });
    });
};