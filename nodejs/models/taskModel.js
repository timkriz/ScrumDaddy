const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const taskSchema = new Schema ({
    name: { type: String, unique: true, required: true, uniqueCaseInsensitive: true},
    description: { type: String, required: true},
    timeEstimate: { type: Number, required: true, min: 0, max: 20},
    timeLog: { type: Number, required: true},
    suggestedUser: { type: String, required: true},
    assignedUser: { type: String, required: true},
    status: { type: String, required: true},
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
    storyId: { type: String, required: true},
});

taskSchema.plugin(uniqueValidator);

var task = module.exports = mongoose.model('task', taskSchema, 'task');

module.exports.get = function (callback, limit) {
    task.find(callback).limit(limit);
}