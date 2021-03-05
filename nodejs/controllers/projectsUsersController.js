const path = require('path');
const projectsUsersModel = require('../models/projectsUsersModel');

exports.view = function (req, res) {
    projectsUsersModel.findOne({_id: req.params.id}, function (err, projectsUsers) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading projectsUserss data..',
            data: projectsUsers
        });
    });
};

// Handle create projectsUsers actions
exports.new = function (req, res) {
    var projectsUsers = new projectsUsersModel();
    projectsUsers.projectId = req.body.projectId;
    projectsUsers.userId = req.body.userId;
    projectsUsers.userRole = req.body.userRole;

    projectsUsers.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'projectsUsers success',
                data: projectsUsers
            });
        }
    });
};

exports.update = function (req, res) {
    projectsUsersModel.findOne({_id: req.params.idprojectsUsers}, function (err, projectsUsers) {
        if (err)
            res.send(err);
        
        projectsUsers.projectId = req.body.projectId;
        projectsUsers.userId = req.body.userId;
        projectsUsers.userRole = req.body.userRole;

        projectsUsers.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'projectsUsers Info updated',
                data: projectsUsers
            });
        });
    });
};

exports.delete = function (req, res) {
    projectsUsersModel.remove({_id: req.params.id}, function (err, projectsUsers) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'projectsUsers deleted'
        });
    });
};