var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)

.get(function(req, res, next){
    var userId = req.decoded._doc._id;

    Favorites.find({postedBy: userId})
    .populate('postedBy')
    .populate('dishes')
    .exec(function(err, fav){
      if (err) throw err;
      res.json(fav);
    });
})

.post( Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._doc._id;
    Favorites.findOne({"postedBy": userId }, function (err, favs) {
        if(!favs){
                 Favorites.create(req.body, function (err, favs) {
                    if (err) throw err;
                    favs.postedBy = userId;
                    console.log('your favorite has been created!');
                    favs.dishes.push(req.body._id);
                     favs.save(function (err, favs) {
                        if (err) throw err;
                        console.log('Dish added');
                        res.json(favs);
                    });
                  });

        }else{
              var test = favs.dishes.indexOf(req.body._id);
              if(test > -1){
                 var err = new Error('This recipe is already in your favorite list');
                 err.status = 401;
                return next(err);
              }else{
              favs.dishes.push(req.body._id);
                favs.save(function (err, favs) {
                  if (err) throw err;
                  console.log('Dish added');
                    res.json(favs);
                 });
              }
              }
    });
})

.delete(function(req, res, next){
    var userId = req.decoded._doc._id

    Favorites.remove({postedBy: userId}, function(err, resp){
      if (err) throw err;
      res.json(resp);
    });
});

favoriteRouter.route('/:dishId')

.delete(Verify.verifyOrdinaryUser, function(request, response, next) {

	Favorites.findOne({'postedBy': request.decoded._doc._id}, function(err, favorite) {
        if(err)
			throw err;

		if(favorite && favorite.dishes)
		{
			for(var i=0; i<favorite.dishes.length; i++)
			{
				if(favorite.dishes[i] == request.params.dishId)
				{
					favorite.dishes.splice(i, 1);
				}
			}
			favorite.save(function(err, favorite) {
				if(err)
					throw err;
				console.log('Deleted Favorite! ' + request.params.dishId);
				response.json(favorite);
			});
		}
    });

});

module.exports = favoriteRouter;
