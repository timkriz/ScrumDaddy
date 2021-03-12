const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintSchema = new Schema ({
    name: { type: String, required: true},
    description: { type: String, required: true},
    startTime: { type: Number, required: true},
    endTime: { type: Number, required: true},
    velocity: { type: Number, required: true},
    projectId: { type: String, required: true},
});

var sprint = module.exports = mongoose.model('sprint', sprintSchema, 'sprint');

module.exports.get = function (callback, limit) {
    sprint.find(callback).limit(limit);
}