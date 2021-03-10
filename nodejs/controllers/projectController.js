const path = require('path');
const projectModel = require('../models/projectModel');

exports.viewAll = function (req, res) {
    projectModel.find(function (err, projects) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({
            message: 'Loading projects data..',
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
            message: 'Loading projects data..',
            data: project
        });
    });
};

// Handle create project actions
exports.new = function (req, res) {
    var project = new projectModel();
    project.projectName = req.body.projectName;
    project.projectDescription = req.body.projectDescription;

    project.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'project success',
                data: project
            });
        }
    });
};

exports.update = function (req, res) {
    projectModel.findOne({_id: req.params.projectid}, function (err, project) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        
        project.projectName = req.body.projectName;
        project.projectDescription = req.body.projectDescription;

        project.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'project Info updated',
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
            status: "success",
            message: 'project deleted'
        });
    });
};