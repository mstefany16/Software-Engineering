var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin,
  function(req, res, next) {
    User.find({}, function(err, user){
      if(err) {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
      }
      res.json(user);
    });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if(req.body.firstname){
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname){
          user.lastname = req.body.lastname;
        }
        user.save(function(err,user){
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
              status: 'Registration Successful!'});
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local',
  function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var admin = user.admin;
      var token = Verify.getToken({"username":user.username, "_id":user._id,
      "admin":user.admin});
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        admin : admin
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});


router.get('/account', Verify.verifyOrdinaryUser, function(req, res, next){

  var userUsername = req.decoded.username;
  User.findOne({
    username: userUsername
  })
  .populate('postedBy')
  .exec(function (err, useracc) {
    if (err) return next(err);
    res.json(useracc);
  });

})

router.delete('/account', Verify.verifyOrdinaryUser, function(req, res, next){
  var userId = req.decoded._id;
  var userUsername = req.decoded.username;
  console.log(userUsername);
  User.findByIdAndRemove(userId, function (err, resp) {
    if (err) next(err);
      res.json(resp);
    });

});

router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
    var token = Verify.getToken(user);

    res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});


module.exports = router;
