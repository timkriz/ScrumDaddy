const path = require('path');
const projectsUsersModel = require('../models/projectsUsersModel');

exports.viewAll = function (req, res) {
    projectsUsersModel.find({projectId: req.params.projectid}, function (err, projectsUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "ProjectsUsers found",
            data: projectsUsers
        });
    });
};

exports.view = function (req, res) {
    projectsUsersModel.findOne({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "ProjectsUsers found",
            data: projectsUsers
        });
    });
};

exports.new = function (req, res) {
    var projectsUsers = new projectsUsersModel();
    
    projectsUsers.userId        = req.body.userId;
    projectsUsers.userRole      = req.body.userRole;
    projectsUsers.projectId     = req.params.projectid;

    projectsUsers.save(function (err) {
        if (err){
            res.status(400).json(err)
            return;
        }
        res.json({
            message: "ProjectsUsers created",
            data: projectsUsers
        });
    });
};

exports.update = function (req, res) {
    projectsUsersModel.findOne({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        
        projectsUsers.userRole          = req.body.userRole || projectsUsers.userRole;
        projectsUsers.projectId         = req.body.projectId || projectsUsers.projectId;

        projectsUsers.save(function (err) {
            if (err){
                res.status(400).json(err)
                return;
            }
            res.json({
                message: "ProjectsUsers updated",
                data: projectsUsers
            });
        });
    });
};

exports.delete = function (req, res) {
    projectsUsersModel.remove({$and:[{userId: req.params.userid}, {projectId:req.params.projectid}]}, function (err, projectsUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "ProjectsUsers deleted",
            data: projectsUsers
        });
    });
};

exports.deleteMany = function (req, res) {
    projectsUsersModel.deleteMany({projectId: req.params.projectid}, function (err, projectsUsers) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "ProjectsUsers deleted",
            data: projectsUsers
        });
    });
};
