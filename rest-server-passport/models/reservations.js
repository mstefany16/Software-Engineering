var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var reservationSchema = new Schema({
  //default date.now
  date:{
    type: String,
  required: true
},
  time:{
    type: Number,
    required: true
  },
  tabNum:{
    type: Number,
    min: 1,
    max: 4
  },
  guests:{
    type: Number,
    min: 1,
    max: 6,
  },
  section:{
    type: String,
    default: "inside",
    required: true
  },
  reserved:{
    type: Boolean,
    default: false
  },
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

var Reservations = mongoose.model('Reservations', reservationSchema);

module.exports = Reservations;
