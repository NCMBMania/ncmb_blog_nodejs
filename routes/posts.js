var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');

/* GET home page. */
router.get('/new', function(req, res, next) {
  res.render('posts/new');
});

module.exports = router;
