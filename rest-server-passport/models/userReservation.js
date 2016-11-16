
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userReservationSchema = new Schema({
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    }
  ]
}, {
  timestamps: true
});


var Favorites = mongoose.model('UserReservation', userReservationSchema);

module.exports = UserReservation;
