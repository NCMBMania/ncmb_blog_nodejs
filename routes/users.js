var express = require('express');
var router = express.Router();
var ncmb   = require('../libs/ncmb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  var acl = new ncmb.Acl();
  acl.setPublicReadAccess(true);
  
  var user = new ncmb.User();
  user
    .set("userName", req.body.userName)
    .set("password", req.body.password)
    .set("acl", acl)
    .signUpByAccount()
      .then(function(user) {
        res.status(201).json(user);
      })
      .catch(function(err) {
        res.status(401).json(err);
      })
});

module.exports = router;
