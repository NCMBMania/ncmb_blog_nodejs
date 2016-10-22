var express = require('express');
var router = express.Router();
var ncmb = require('../libs/ncmb');

/* GET home page. */
router.get('/', function(req, res, next) {
  var Post = ncmb.DataStore('Post');
  ncmb.sessionToken = req.session.currentUser ? req.session.currentUser.sessionToken : null;
  Post.editable = function(post) {
    if (typeof req.session.currentUser === 'undefined') {
      return false;
    }
    if (post.acl['*'] && post.acl['*'].write)
      return true;
    objectId = req.session.currentUser.objectId;
    if (post.acl[objectId] && post.acl[objectId].write)
      return true;
  }
  
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
