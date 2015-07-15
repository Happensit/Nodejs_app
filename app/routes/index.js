var express = require('express');
var router = express.Router();
//var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {

    req.add_flash('success', 'Hello! This is flash from redirected request.');
    res.render('index', { title: 'Express', 'test': "Test"});
});

module.exports = router;
