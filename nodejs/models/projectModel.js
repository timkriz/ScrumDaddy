const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema ({
    projectName: { type: String, required: true},
    projectDescription: { type: String, required: true},
});

var project = module.exports = mongoose.model('project', projectSchema, 'project');

module.exports.get = function (callback, limit) {
    project.find(callback).limit(limit);
}