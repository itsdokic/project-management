var express = require('express');
var router = express.Router();



/* -------------- U S E R -------------- */



router.get('/user', function(req, res, next) {

    res.render('managerUser');
});


router.get('/user/edit', function(req, res, next) {

    res.render('managerEditUser');
});



/* -------------- P R O J E C T S -------------- */



router.get('/projects', function(req, res, next) {

  res.render('managerProjects');
});


router.get('/projects/addProject', function(req, res, next) {

    res.render('managerAddProject');
});


router.get('/projects/editProject', function(req, res, next) {

    res.render('managerEditProject');
});



/* -------------- W O R K E R S -------------- */



router.get('/workers', function(req, res, next) {

    res.render('managerWorkers');
});


router.get('/workers/editWorker', function(req, res, next) {

    res.render('managerEditWorker');
});



/* -------------- T A S K S -------------- */



router.get('/tasks', function(req, res, next) {

    res.render('managerTasks');
});


router.get('/tasks/addTask', function(req, res, next) {

    res.render('managerAddTask');
});


router.get('/tasks/editTask', function(req, res, next) {

    res.render('managerEditTask');
});



/* -------------- L O G S -------------- */



router.get('/logs', function(req, res, next) {

    res.render('managerLogs');
});



module.exports = router;
