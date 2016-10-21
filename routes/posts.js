var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');

/* GET home page. */
router.get('/new', function(req, res, next) {
  res.render('posts/new');
});

router.get('/:objectId', function(req, res, next) {
  let Post = ncmb.DataStore('Post');
  Post.equalTo('objectId', req.params.objectId)
    .fetch()
    .then(function(post) {
      res.render('posts/show', { post: post });
    });
});

router.post('/', function(req, res, next) {
  // ユーザの作成
  var currentUser = new ncmb.User(req.session.currentUser);
  let Post = ncmb.DataStore('Post');
  var post = new Post;
  post.set('title', req.body.title);
  post.set('body', req.body.body);
  var acl = new ncmb.Acl;
  
  post.set('public', (req.body.public == 'true'));
  if (req.body.public == 'true') {
    acl.setPublicReadAccess(true);
  } else {
    acl.setUserReadAccess(currentUser, true)
  }
  acl.setUserWriteAccess(currentUser, true)
  post.set('acl', acl);
  post.save()
    .then(function(obj) {
      res.status(201).json(obj);
    })
    .catch(function(err) {
      res.status(401).json(err);
    })
});



module.exports = router;
