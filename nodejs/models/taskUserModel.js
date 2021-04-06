const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskUserSchema = new Schema ({
    userId: { type: String, required: true},
    timeLog: { type: Number, required: true},
    timestamp: { type: Number, required: true},
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
    storyId: { type: String, required: true},
    taskId: { type: String, required: true},
});

var taskUser = module.exports = mongoose.model('taskUser', taskUserSchema, 'taskUser');

module.exports.get = function (callback, limit) {
    taskUser.find(callback).limit(limit);
}