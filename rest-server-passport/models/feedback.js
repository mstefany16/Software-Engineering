var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var feedbackSchema = new Schema({
    firstName:  {
        type: String,
        required: true
    },
    lastName:  {
        type: String,
        required: true
    },
    tel:{
      type: Number,
    },
    email:{
      type: String,
      required: true
    },
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comments:{
      type: String,
      required: true
    },
    postedBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Feedback = mongoose.model('Feedback', feedbackSchema);

// make this available to our Node applications
module.exports = Feedback;
