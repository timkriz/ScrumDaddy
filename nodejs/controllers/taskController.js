const path = require('path');
const taskModel = require('../models/taskModel');

exports.viewAll = function (req, res) {
    taskModel.find({taskStoryId: req.params.storyid}, function (err, tasks) {
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

    task.taskName = req.body.taskName;
    task.taskDescription = req.body.taskDescription;
    task.taskTimeEstimate = req.body.taskTimeEstimate;
    task.taskSuggestedUser = req.body.taskSuggestedUser;
    task.taskAssignedUser = req.body.taskAssignedUser;
    task.taskStoryId = req.params.storyid;

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
        
        task.taskName = req.body.taskName || task.taskName;
        task.taskDescription = req.body.taskDescription || task.taskDescription;
        task.taskTimeEstimate = req.body.taskTimeEstimate || task.taskTimeEstimate;
        task.taskSuggestedUser = req.body.taskSuggestedUser || task.taskSuggestedUser;
        task.taskAssignedUser = req.body.taskAssignedUser || task.taskAssignedUser;
        task.taskStoryId = req.params.storyid || task.taskStoryId;

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
            message: "Task removed",
            data: task
        });
    });
};