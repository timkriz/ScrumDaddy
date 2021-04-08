const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storyNoteSchema = new Schema ({
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
    storyId: { type: String, required: true},
    userId: { type: String, required: true},
    timestamp: { type: Number, required: true},
    text: { type: String, required: true},
    userRole: { type: String, required: true},
});

var storyNote = module.exports = mongoose.model('storyNote', storyNoteSchema, 'storyNote');

module.exports.get = function (callback, limit) {
    storyNote.find(callback).limit(limit);
}