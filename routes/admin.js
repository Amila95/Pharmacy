var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.render('admin/basic', {title: 'Express',layout:'admin'})

});
module.exports = router;
