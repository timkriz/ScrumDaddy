const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    projectId: { type: String, required: true},
    userId: { type: String, required: true},
    timestamp: { type: Number, required: true},
    text: { type: String, required: true},
});

var post = module.exports = mongoose.model('post', postSchema, 'post');

module.exports.get = function (callback, limit) {
    post.find(callback).limit(limit);
}