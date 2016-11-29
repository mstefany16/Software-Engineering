var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Reservations = require('../models/reservations');
var Verify = require('./verify');


var reservationRouter = express.Router();
reservationRouter.use(bodyParser.json());

reservationRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next){
  var userId = req.decoded._id;
    Reservations.find({
    })
      .populate('postedBy')
      .exec(function (err, reservation) {
        if (err) return next(err);
        res.json(reservation);
    });
})
.post(function (req, res, next){
  var userTime = req.body.time;

  var userDate = req.body.date;
  var userGuests = req.body.guests;
  var userSection = req.body.section;

  req.body.postedBy = req.decoded._id;

  Reservations.findOneAndUpdate({"time": userTime, "section": userSection,
  "date": userDate, "reserved": false},
      { $set:{reserved: true, postedBy: req.body.postedBy}},
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

    })
    .delete(function (req, res, next) {
      var userId = req.decoded._id;

      Reservations
        .findOneAndRemove({
          postedBy: userId
        }, function (err, resp) {
          if (err) next (err);
          res.json(resp);
        });
    });

reservationRouter.route('/myreservations')
.all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next){
      var userId = req.decoded._id;
        Reservations.find({postedBy: userId})
          .populate('postedBy')
          .exec(function (err, reservation) {
            if (err) return next(err);
            res.json(reservation);
        });
    })
reservationRouter.route('/myreservations/:reserveId')
    .delete(function (req, res, next) {
      Reservations.findByIdAndRemove(req.params.reserveId, function (err, resp) {
        if (err) next(err);
          res.json(resp);
      });
    });
module.exports = reservationRouter;
