const path = require('path');
const userModel = require('../models/userModel');

exports.find = function (req, res) {
    userModel.findOne({_id: req.params.id}, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'Finding user..',
            data: user
        });
    });
};

exports.view = function (req, res) {
    userModel.find(function (err, users) {
        if (err)
            res.json(err);
        res.json({
            message: 'Finding users..',
            data: users
        });
    });
};

// Handle create user actions
exports.new = function (req, res) {
    var user = new userModel();
    user.username = req.body.username;
    user.password = req.body.password;
    user.role = req.body.role;
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.email = req.body.email;

    user.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'User created',
                data: user
            });
        }
    });
};

exports.update = function (req, res) {
    userModel.findById(req.params.uid, function (err, user) {
        if (err)
            res.send(err);
        
        user.username = req.body.username;
        user.password = req.body.password;
        user.role = req.body.role;
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.email = req.body.email;

        user.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.delete = function (req, res) {
    userModel.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User deleted',
            data: user,
        });
    });
};
