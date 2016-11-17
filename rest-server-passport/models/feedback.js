var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
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
