const path = require('path');
const reportModel = require('../models/reportModel');

exports.view = function (req, res) {
    reportModel.find({$or: [{idVillageAttacker: req.params.idVillage}, {idVillageDefender: req.params.idVillage}] }, function (err, report) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading reports data..',
            data: report
        });
    });
};

// Handle create report actions
exports.new = function (req, res) {
    var report = new reportModel();
    report.idVillageAttacker = req.body.idVillageAttacker;
    report.idVillageDefender = req.body.idVillageDefender;
    report.tribeAttacker = req.body.tribeAttacker;
    report.tribeDefender = req.body.tribeDefender;
    report.bountyWood = req.body.bountyWood;
    report.bountyClay = req.body.bountyClay;
    report.bountyIron = req.body.bountyIron;
    report.bountyCrop = req.body.bountyCrop;
    for(let i = 1; i < 11; i++){
        report['attTroop'+i] = req.body['attTroop'+i];
        report['defTroop'+i]  = req.body['defTroop'+i];
        report['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
        report['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
    }

    report.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'report success',
                data: report
            });
        }
    });
};

exports.update = function (req, res) {
    reportModel.findOne({_id: req.params.idReport}, function (err, report) {
        if (err)
            res.send(err);
        
        report.idVillageAttacker = req.body.idVillageAttacker;
        report.idVillageDefender = req.body.idVillageDefender;
        report.tribeAttacker = req.body.tribeAttacker;
        report.tribeDefender = req.body.tribeDefender;
        report.bountyWood = req.body.bountyWood;
        report.bountyClay = req.body.bountyClay;
        report.bountyIron = req.body.bountyIron;
        report.bountyCrop = req.body.bountyCrop;
        for(let i = 1; i < 10; i++){
            report['attTroop'+i] = req.body['attTroop'+i];
            report['defTroop'+i]  = req.body['defTroop'+i];
            report['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
            report['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
        }

        report.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'report Info updated',
                data: report
            });
        });
    });
};

exports.delete = function (req, res) {
    reportModel.remove({idReport: req.params.idReport}, function (err, report) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'report deleted'
        });
    });
};