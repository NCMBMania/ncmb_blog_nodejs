var express = require('express');
var router = express.Router();
var ncmb = require('../libs/ncmb');

/* GET home page. */
router.get('/', function(req, res, next) {
  var Post = ncmb.DataStore('Post');
  if (req.session.currentUser) {
    ncmb.sessionToken = req.session.currentUser.sessionToken;
  }
  Post.order('createDate', true).fetchAll()
    .then(function(posts) {
      res.render('index', { posts: posts, currentUser: req.session.currentUser});
    })
});

router.get('/login', function(req, res, next) {
  res.render('sessions/new');
});

router.get('/register', function(req, res, next) {
  res.render('users/new');
});

module.exports = router;
