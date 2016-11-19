var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Reservations = require('../models/reservations');
var Verify = require('./verify');


var reservationRouter = express.Router();
reservationRouter.use(bodyParser.json());

reservationRouter.route('/reserve')
.post(function(req,res,next){
  var userTime = req.body.time;
  var userDate = req.body.date;
  var userSection = req.body.section;
  Reservations.findOne({"time": userTime, "section": userSection, "date": userDate, "reserved": false})
    .populate('postedBy')
    .exec(function (err, reservation) {
      if (err) next(err);
      res.json(reservation);
  });
});

reservationRouter.route('/reserve')
.get(function (req, res, next){
    Reservations.find(req.query)
      .populate('postedBy')
      .exec(function (err, reservation) {
        if (err) return next(err);
        res.json(reservation);
    });
})
.post(function (req, res, next){
  var userTime = req.body.time;
  var userDate = req.body.date;
  var userSection = req.body.section;

  Reservations.findOneAndUpdate({"time": userTime, "section": userSection, "date": userDate, "reserved": false},
      { $set:{reserved: true}},
      {returnNewDocument: true},
      function (err, reservation) {
        if (err) return next(err);
        console.log('Reservation successful');
        res.json(reservation);
      })

    });

module.exports = reservationRouter;
