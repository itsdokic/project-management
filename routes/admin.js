var express = require('express');
var router = express.Router();



/* -------------- U S E R -------------- */



router.get('/user', function(req, res, next) {

    res.render('adminUser');
});


router.get('/user/edit', function(req, res, next) {

    res.render('adminEditUser');
});



/* -------------- P R O J E C T S -------------- */



router.get('/projects', function(req, res, next) {

  res.render('adminProjects');
});


router.get('/projects/addProject', function(req, res, next) {

    res.render('adminAddProject');
});


router.get('/projects/editProject', function(req, res, next) {

    res.render('adminEditProject');
});



/* -------------- W O R K E R S -------------- */



router.get('/workers', function(req, res, next) {

    res.render('adminWorkers');
});

router.get('/workers/addWorker', function(req, res, next) {

    res.render('adminAddWorker');
});

router.get('/workers/editWorker', function(req, res, next) {

    res.render('adminEditWorker');
});



/* -------------- T A S K S -------------- */



router.get('/tasks', function(req, res, next) {

    res.render('adminTasks');
});


router.get('/tasks/addTask', function(req, res, next) {

    res.render('adminAddTask');
});


router.get('/tasks/editTask', function(req, res, next) {

    res.render('adminEditTask');
});



/* -------------- L O G S -------------- */



router.get('/logs', function(req, res, next) {

    res.render('adminLogs');
});


module.exports = router;
