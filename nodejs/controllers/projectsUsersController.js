const path = require('path');
const projectsUsersModel = require('../models/projectsUsersModel');

exports.viewAll = function (req, res) {
    projectsUsersModel.find({projectId: req.params.projectid}, function (err, projectsUsers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading projectsUserss data..',
            data: projectsUsers
        });
    });
};

exports.view = function (req, res) {
    projectsUsersModel.findOne({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading projectsUserss data..',
            data: projectsUsers
        });
    });
};

// Handle create projectsUsers actions
exports.new = function (req, res) {
    var projectsUsers = new projectsUsersModel();
    projectsUsers.projectId = req.params.projectid;
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
    projectsUsersModel.findOne({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        
        projectsUsers.projectId = req.body.projectid;
        projectsUsers.userId = req.params.userid;
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
    projectsUsersModel.remove({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            status: "success",
            message: 'projectsUsers deleted'
        });
    });
};

exports.deleteMany = function (req, res) {
    projectsUsersModel.deleteMany({projectId: req.params.projectid}, function (err, projectsUsers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            status: "success",
            message: 'projectsUsers deleted'
        });
    });
};