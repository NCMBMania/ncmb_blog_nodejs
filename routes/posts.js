var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');
var common = require('../libs/common');

/* GET home page. */
router.get('/new', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  res.render('posts/new');
});

router.get('/:objectId', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  let Post = ncmb.DataStore('Post');
  Post.equalTo('objectId', req.params.objectId)
    .fetch()
    .then(function(post) {
      res.render('posts/show', { post: post });
    });
});

router.get('/:objectId/edit', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  let Post = ncmb.DataStore('Post');
  Post.equalTo('objectId', req.params.objectId)
    .fetch()
    .then(function(post) {
      res.render('posts/edit', { post: post });
    });
});

router.post('/', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  post = buildPost(req);
  post.save()
    .then(function(obj) {
      res.status(201).json(obj);
    })
    .catch(function(err) {
      res.status(401).json(err);
    })
});

router.put('/:objectId', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  post = buildPost(req);
  post.update()
    .then(function(obj) {
      res.status(200).json(obj);
    })
    .catch(function(err) {
      res.status(401).json(err);
    })
});

function buildPost(req) {
  // ユーザの作成
  var currentUser = new ncmb.User(req.session.currentUser);
  let Post = ncmb.DataStore('Post');
  var post = new Post;
  post.set('objectId', req.params.objectId);
  post.set('title', req.body.title);
  post.set('body', req.body.body);
  var acl = new ncmb.Acl;
  post.set('public', req.body.public || false);
  if (req.body.public) {
    acl.setPublicReadAccess(true);
  }
  acl.setUserReadAccess(currentUser, true);
  acl.setUserWriteAccess(currentUser, true);
  post.set('acl', acl);
  
  return post;
}

module.exports = router;
