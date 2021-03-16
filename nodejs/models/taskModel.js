const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema ({
    name: { type: String, required: true},
    description: { type: String, required: true},
    timeEstimate: { type: Number, required: true},
    suggestedUser: { type: String, required: true},
    assignedUser: { type: String, required: true},
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
    storyId: { type: String, required: true},
});

var task = module.exports = mongoose.model('task', taskSchema, 'task');

module.exports.get = function (callback, limit) {
    task.find(callback).limit(limit);
}