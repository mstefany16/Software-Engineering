var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Feedback = require('../models/feedback');
var Verify = require('./verify');


var feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.get(function (req, res, next){
    Feedback.find(req.query)
      .populate('postedBy')
      .exec(function (err, feedback) {
        if (err) next(err);
        res.json(feedback);
    });
})

.post(Verify.verifyOrdinaryUser,function (req, res, next) {
    Feedback.create(req.body, function (err, feedback) {
        if (err) next(err);
        console.log('Feedback created!');
        var id = feedback._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the feedback with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,function (req, res, next) {
    Feedback.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = feedbackRouter;
