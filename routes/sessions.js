var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');

router.post('/', function(req, res, next) {
  var User = new ncmb.User({userName: req.body.userName, password: req.body.password});
  User.login()
    .then(function(user) {
      req.session.currentUser = user;
      res.status(200).json(user)
    })
    .catch(function(err) {
      res.status(400).json(err)
    });
});

router.delete('/', function(req, res, next) {
  delete req.session['currentUser'];
  res.status(200).json({})
});

module.exports = router;
