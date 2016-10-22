var express = require('express');
var router = express.Router();
var ncmb = require('../libs/ncmb');
var common = require('../libs/common');
var Post   = require('../models/post')(ncmb);

/* GET home page. */
router.get('/', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  Post.order('createDate', true).fetchAll()
    .then(function(posts) {
      res.render('index', { posts: posts, currentUser: req.session.currentUser, Post: Post});
    })
});

router.get('/login', function(req, res, next) {
  res.render('sessions/new');
});

router.get('/register', function(req, res, next) {
  res.render('users/new');
});

module.exports = router;
