const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    postId: { type: String, required: true},
    userId: { type: String, required: true},
    timestamp: { type: Number, required: true},
    text: { type: String, required: true},
});

var comment = module.exports = mongoose.model('comment', commentSchema, 'comment');

module.exports.get = function (callback, limit) {
    comment.find(callback).limit(limit);
}