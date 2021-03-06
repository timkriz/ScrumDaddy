const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsUsersSchema = new Schema ({
    projectId: { type: String, required: true},
    userId: { type: String, required: true},
    userRole: { type: Number, required: true},
});

var projectsUsers = module.exports = mongoose.model('projectsUsers', projectsUsersSchema, 'projectsUsers');

module.exports.get = function (callback, limit) {
    projectsUsers.find(callback).limit(limit);
}