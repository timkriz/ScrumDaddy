const path = require('path');
const storyNoteModel = require('../models/storyNoteModel');

exports.viewAll = function (req, res) {
    storyNoteModel.find({storyId: req.params.storyid}, function (err, notes) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Notes found",
            data: notes
        });
    });
};

exports.new = function (req, res) {
    var note = new storyNoteModel();

    note.userId         = req.body.userId;
    note.timestamp      = req.body.timestamp;
    note.text           = req.body.text;
    note.projectId      = req.body.projectId;
    note.sprintId       = req.body.sprintId;
    note.storyId        = req.body.storyId;

    note.save(function (err) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Note created",
            data: note
        });
    });
};

exports.deleteMany = function (req, res) {
    storyNoteModel.deleteMany({storyId: req.params.storyid}, function (err, notes) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Notes deleted",
            data: notes
        });
    });
};

exports.delete = function (req, res) {
    storyNoteModel.remove({_id: req.params.noteid}, function (err, note) {
        if (err) {
            res.status(400).json({
                message: err.toString(),
                data: ""});
            return;
        }
        res.json({
            message: "Note removed",
            data: note
        });
    });
};