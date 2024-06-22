var express = require('express');
var router = express.Router();



/* -------------- U S E R -------------- */



router.get('/user', function(req, res, next) {

  res.render('workerUser');
});


router.get('/user/edit', function(req, res, next) {

  res.render('workerEditUser');
});



/* -------------- P R O J E C T -------------- */



router.get('/project', function(req, res, next) {

  res.render('workerProject');
});



/* -------------- T A S K S -------------- */



router.get('/tasks', function(req, res, next) {

  res.render('workerTasks');
});



/* -------------- W O R K   T I M E -------------- */



router.get('/workHours', function(req, res, next) {

  res.render('workerWorkHours');
});



module.exports = router;
