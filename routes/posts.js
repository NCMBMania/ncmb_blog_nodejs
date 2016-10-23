var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');
var common = require('../libs/common');
var config = require('../config');
var Post   = require('../models/post')(ncmb);

/* GET home page. */
router.get('/new', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  res.render('posts/new');
});

router.get('/:objectId', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  Post.equalTo('objectId', req.params.objectId)
    .fetch()
    .then(function(post) {
      res.render('posts/show', { post: post });
    });
});

router.get('/:objectId/edit', function(req, res, next) {
  common.setSessionToken(req, ncmb);
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

router.post('/files', function(req, res, next) {
  common.setSessionToken(req, ncmb);
  extension = common.detectFileType(req.rawBody);
  name = `${common.guid()}.${extension}`
  ncmb.File.upload(name, req.rawBody)
    .then(function(data){
      // アップロード後処理
      var json = {
        url: `https://mb.api.cloud.nifty.com/2013-09-01/applications/${config.application_id}/publicFiles/${name}`
      }
      res.status(200).json(json);
     })
    .catch(function(err){
      // エラー処理
      res.status(400).json(err);
    });
});

function buildPost(req) {
  // ユーザの作成
  var currentUser = new ncmb.User(req.session.currentUser);
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
