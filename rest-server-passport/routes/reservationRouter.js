var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Reservations = require('../models/reservations');
var Verify = require('./verify');


var reservationRouter = express.Router();
reservationRouter.use(bodyParser.json());

reservationRouter.route('/reserve')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next){
    Reservations.find(req.query)
      .populate('postedBy')
      .exec(function (err, reservation) {
        if (err) return next(err);
        console.log(reservation.postedBy);
        res.json(reservation);
    });
})
.post(function (req, res, next){
  var userTime = req.body.time;

  var userDate = req.body.date;
  var userGuests = req.body.guests;
  var userSection = req.body.section;

  Reservations.findOneAndUpdate({"time": userTime, "section": userSection, "date": userDate, "guests": userGuests, "reserved": false},
      { $set:{reserved: true}},
      {returnNewDocument: true},
      function (err, reservation) {
        if (err) return next(err);

        if(reservation == null){
            return res.status(200).json({
              status: 'Table not found for the following information: time: '+ userTime +
              ', date: ' + userDate +
              ', guests: ' + userGuests +
              ', and section: ' + userSection 
            });
        }
        else{
        console.log('Reservation successful');
        return res.status(200).json({
          status: 'Reservation made for: time: '+ userTime +
          ', date: ' + userDate +
          ', and section: ' + userSection + '!'
        });
        res.json(reservation);
      }
      })

    });
reservationRouter.route('/reserve/:reserveId')
    .get(function (req, res, next){
        Reservations.findById(req.params.reserveId)
          .populate('postedBy')
          .exec(function (err, reservation) {
            if (err) return next(err);
            res.json(reservation);
        });
    })

module.exports = reservationRouter;
