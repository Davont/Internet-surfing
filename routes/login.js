var express = require('express');
var router = express.Router();
var login=require('../modules/login')
var logout=require('../modules/logout')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.type('html');
  res.render('login');
});
router.get('/login', function(req, res, next) {
  login(req,res,next);
});
router.get('/success/*', function(req, res, next) {
  res.type('html');
  res.render('success');
});
router.get('/logout', function(req, res, next) {
  logout(req,res,next);
});
module.exports = router;
