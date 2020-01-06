var express = require('express');
var router = express.Router();
var card=require('../mysql/cardsql')
var record=require('../mysql/record')

//card接口访问
router.get('/addCard', function(req, res, next) {
  card.add(req, res, next);
});
router.get('/cardQueryAll', function(req, res, next) { 
  card.queryAll(req, res, next);
});

router.get('/cardQuery', function(req, res, next) {
  card.queryById(req, res, next);
});
router.get('/deleteCard', function(req, res, next) {
  card.delete(req, res, next);
});
router.post('/updateCard', function(req, res, next) {
  card.update(req, res, next);
});
router.post('/addbalance', function(req, res, next) {
  console.log(123231)
  card.addbalance(req, res, next);
});
//record接口访问
router.get('/addRecord', function(req, res, next) {
  record.add(req, res, next);
});
router.get('/recordQueryAll', function(req, res, next) { 
  record.queryAll(req, res, next);
});

router.post('/recordQuery', function(req, res, next) {
  record.queryById(req, res, next);
});
router.get('/deleteRecord', function(req, res, next) {
  record.delete(req, res, next);
});
router.post('/updateRecord', function(req, res, next) {
  record.update(req, res, next);
});
module.exports = router;
