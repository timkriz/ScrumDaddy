const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const storySchema = new Schema ({
    name: { type: String, unique: true, required: true, uniqueCaseInsensitive: true},
    description: { type: String, required: true},
    timeEstimate: { type: Number, required: true, min: 0, max: 100},
    businessValue: { type: Number, required: true, min: 1, max: 10},
    comment: { type: String, required: true},
    priority: { type: String, required: true},
    tests: { type: String, required: true},
    status: { type: String, required: true},
    projectId: { type: String, required: true},
    sprintId: { type: String, required: true},
});

storySchema.plugin(uniqueValidator);

var story = module.exports = mongoose.model('story', storySchema, 'story');

module.exports.get = function (callback, limit) {
    story.find(callback).limit(limit);
}