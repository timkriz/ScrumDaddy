const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema ({
    taskName: { type: String, required: true},
    taskDescription: { type: String, required: true},
    taskTimeEstimate: { type: Number, required: true},
    taskSuggestedUser: { type: String, required: true},
    taskAssignedUser: { type: String, required: true},
    taskStoryId: { type: String, required: true},
});

var task = module.exports = mongoose.model('task', taskSchema, 'task');

module.exports.get = function (callback, limit) {
    task.find(callback).limit(limit);
}