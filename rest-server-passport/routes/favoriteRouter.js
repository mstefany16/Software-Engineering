var express = require('express');
var bodyParser = require('body-parser');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .all(Verify.verifyOrdinaryUser)
  .get(function (req, res, next) {
    var userId = req.decoded._id;

//favorites = db.collection
    Favorites
      .findOne({
        postedBy: userId
      })
      .populate('postedBy dishes')
      .exec(function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      });
  })
  .post(function (req, res, next) {
    var userId = req.decoded._id;

    Favorites
      .findOneAndUpdate({
        postedBy: userId
      }, {
        $addToSet: {
          dishes: req.body
        }
      }, {
        upsert: true,
        new: true
      }, function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      });
  })
  .delete(function (req, res, next) {
    var userId = req.decoded._id;

    Favorites
      .findOneAndRemove({
        postedBy: userId
      }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
      });
  });

favoriteRouter.route('/:dishId')
  .all(Verify.verifyOrdinaryUser)
  .delete(function (req, res, next) {
    var userId = req.decoded._id;

    Favorites.findOneAndUpdate({
      postedBy: userId
    }, {
      $pull: {
        dishes: req.params.dishId
      }
    }, {
      new: true
    }, function (err, favorite) {
      if (err) throw err;

      res.json(favorite);
    });
  });

module.exports = favoriteRouter;
