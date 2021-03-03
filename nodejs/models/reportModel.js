const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema ({
        idVillageAttacker: { type: String, required: true},
        idVillageDefender: { type: String, required: true},
        tribeAttacker: { type: String, required: true},
        tribeDefender: { type: String, required: true},
        bountyWood: { type: Number, required: true},
        bountyClay: { type: Number, required: true},
        bountyIron: { type: Number, required: true},
        bountyCrop: { type: Number, required: true},
        attTroop1: { type: Number, required: true },
        attTroop2: { type: Number, required: true },
        attTroop3: { type: Number, required: true },
        attTroop4: { type: Number, required: true },
        attTroop5: { type: Number, required: true },
        attTroop6: { type: Number, required: true },
        attTroop7: { type: Number, required: true },
        attTroop8: { type: Number, required: true },
        attTroop9: { type: Number, required: true },
        attTroop10: { type: Number, required: true },
        attTroop1Casualty: { type: Number, required: true },
        attTroop2Casualty: { type: Number, required: true },
        attTroop3Casualty: { type: Number, required: true },
        attTroop4Casualty: { type: Number, required: true },
        attTroop5Casualty: { type: Number, required: true },
        attTroop6Casualty: { type: Number, required: true },
        attTroop7Casualty: { type: Number, required: true },
        attTroop8Casualty: { type: Number, required: true },
        attTroop9Casualty: { type: Number, required: true },
        attTroop10Casualty: { type: Number, required: true },
        defTroop1: { type: Number, required: true },
        defTroop2: { type: Number, required: true },
        defTroop3: { type: Number, required: true },
        defTroop4: { type: Number, required: true },
        defTroop5: { type: Number, required: true },
        defTroop6: { type: Number, required: true },
        defTroop7: { type: Number, required: true },
        defTroop8: { type: Number, required: true },
        defTroop9: { type: Number, required: true },
        defTroop10: { type: Number, required: true },
        defTroop1Casualty: { type: Number, required: true },
        defTroop2Casualty: { type: Number, required: true },
        defTroop3Casualty: { type: Number, required: true },
        defTroop4Casualty: { type: Number, required: true },
        defTroop5Casualty: { type: Number, required: true },
        defTroop6Casualty: { type: Number, required: true },
        defTroop7Casualty: { type: Number, required: true },
        defTroop8Casualty: { type: Number, required: true },
        defTroop9Casualty: { type: Number, required: true },
        defTroop10Casualty: { type: Number, required: true }
});

var report = module.exports = mongoose.model('report', reportSchema, 'report');

module.exports.get = function (callback, limit) {
    report.find(callback).limit(limit);
}