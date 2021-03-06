const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema ({
    storyName: { type: String, required: true},
    storyTimeEstimate: { type: Number, required: true},
    storyBusinessValue: { type: Number, required: true},
    storyComment: { type: String, required: true},
    storyPriority: { type: Number, required: true},
    storyTests: { type: String, required: true},
    storyStatus: { type: String, required: true},
    storyProjectId: { type: String, required: true},
    storySprintId: { type: String, required: true},
});

var story = module.exports = mongoose.model('story', storySchema, 'story');

module.exports.get = function (callback, limit) {
    story.find(callback).limit(limit);
}