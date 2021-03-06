const path = require('path');
const taskModel = require('../models/taskModel');

exports.view = function (req, res) {
    taskModel.findOne({_id: req.params.id}, function (err, task) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading task data..',
            data: task
        });
    });
};

// Handle create task actions
exports.new = function (req, res) {
    var task = new taskModel();
    task.taskName = req.body.taskName;
    task.taskDescription = req.body.taskDescription;
    task.taskTimeEstimate = req.body.taskTimeEstimate;
    task.taskSuggestedUser = req.body.taskSuggestedUser;
    task.taskAssignedUser = req.body.taskAssignedUser;
    task.taskStoryId = req.body.taskStoryId;

    task.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'projects success',
                data: task
            });
        }
    });
};

exports.update = function (req, res) {
    taskModel.findOne({_id: req.params.id}, function (err, task) {
        if (err)
            res.send(err);
        
            task.taskName = req.body.taskName;
            task.taskDescription = req.body.taskDescription;
            task.taskTimeEstimate = req.body.taskTimeEstimate;
            task.taskSuggestedUser = req.body.taskSuggestedUser;
            task.taskAssignedUser = req.body.taskAssignedUser;
            task.taskStoryId = req.body.taskStoryId;

            task.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'task Info updated',
                data: task
            });
        });
    });
};

exports.delete = function (req, res) {
    taskModel.remove({_id: req.params.id}, function (err, task) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'task deleted'
        });
    });
};