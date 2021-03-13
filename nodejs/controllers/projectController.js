const path = require('path');
const projectModel = require('../models/projectModel');

exports.viewAll = function (req, res) {
    projectModel.find(function (err, projects) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: "Projects found",
            data: projects
        });
    });
};

exports.view = function (req, res) {
    projectModel.findOne({_id: req.params.projectid}, function (err, project) {
        if (err) {
            res.status(400).send(err);
            return;
        }       
        res.json({
            message: "Project found",
            data: project
        });
    });
};

exports.new = function (req, res) {
    var project = new projectModel();
    
    project.name            = req.body.name;
    project.description     = req.body.description;

    project.save(function (err) {
        if (err){
            res.json(err);
            return;
        }
        res.json({
            message: "Project created",
            data: project
        });
    });
};

exports.update = function (req, res) {
    projectModel.findOne({_id: req.params.projectid}, function (err, project) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        
        project.name            = req.body.name || project.name;
        project.description     = req.body.description || project.description;

        project.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: "Project updated",
                data: project
            });
        });
    });
};

exports.delete = function (req, res) {
    projectModel.remove({_id: req.params.projectid}, function (err, project) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: "Project deleted",
            data: project
        });
    });
};