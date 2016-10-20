var express = require('express');
var router = express.Router();
var ncmb = require('../libs/ncmb');

/* GET home page. */
router.get('/', function(req, res, next) {
  var Post = ncmb.DataStore('Post');
  Post.order('createDate', true).fetchAll()
    .then(function(posts) {
      res.render('index', { posts: posts });
    })
});

module.exports = router;
