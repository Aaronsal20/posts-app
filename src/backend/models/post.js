const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  imagePath: {
    type: String,
    required: true
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
})

module.exports = mongoose.model('Post', postSchema);
