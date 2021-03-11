const path = require('path');
const userModel = require('../models/userModel');

exports.find = function (req, res) {
    userModel.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "User found",
            data: user
        });
    });
};

exports.view = function (req, res) {
    userModel.find(function (err, users) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "Users found",
            data: users
        });
    });
};

exports.new = function (req, res) {
    var user = new userModel();

    user.username = req.body.username;
    user.password = req.body.password;
    user.role = req.body.role;
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.email = req.body.email;

    user.save(function (err) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "User created",
            data: user
        });
    });
};

exports.update = function (req, res) {
    userModel.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        
        user.username = req.body.username || user.username;
        user.password = req.body.password || user.password;
        user.role = req.body.role || user.role;
        user.name = req.body.name || user.name;
        user.surname = req.body.surname || user.surname;
        user.email = req.body.email || user.email;

        user.save(function (err) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json({
                message: "User updated",
                data: user
            });
        });
    });
};

exports.delete = function (req, res) {
    userModel.remove({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.json({
            message: "User deleted",
            data: user
        });
    });
};
