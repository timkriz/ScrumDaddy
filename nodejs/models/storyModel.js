const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema ({
    name: { type: String, required: true},
    timeEstimate: { type: Number, required: true},
    businessValue: { type: Number, required: true},
    comment: { type: String, required: true},
    priority: { type: Number, required: true},
    tests: { type: String, required: true},
    status: { type: String, required: true},
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
});

var story = module.exports = mongoose.model('story', storySchema, 'story');

module.exports.get = function (callback, limit) {
    story.find(callback).limit(limit);
}