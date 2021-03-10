const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintSchema = new Schema ({
    sprintName: { type: String, required: true},
    sprintDescription: { type: String, required: true},
    sprintStartTime: { type: Number, required: true},
    sprintEndTime: { type: Number, required: true},
    sprintVelocity: { type: Number, required: true},
    sprintProjectId: { type: String, required: true},
});

var sprint = module.exports = mongoose.model('sprint', sprintSchema, 'sprint');

module.exports.get = function (callback, limit) {
    sprint.find(callback).limit(limit);
}