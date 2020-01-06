var express = require('express');
var router = express.Router();




router.get('/root', function (req, res, next) {
  res.render('root');
});
router.get('/record', function (req, res, next) {
  res.render('record');
});
router.get('/test', function (req, res, next) {
  res.render('test');
});
router.get('/add', function (req, res, next) {
  res.render('addbalance');
});
module.exports = router;