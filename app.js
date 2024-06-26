var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const adminRouter = require('./routes/admin')
const managerRouter = require('./routes/manager')
const workerRouter = require('./routes/worker')
const deleteTokenRouter = require('./routes/deleteToken')
const userRouter = require('./routes/user')
const projectsRouter = require('./routes/projects')
const workersRouter = require('./routes/workers')
const tasksRouter = require('./routes/tasks')
const logsRouter = require('./routes/logs')
const workHoursRouter = require('./routes/workHours')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);
app.use('/worker', workerRouter)
app.use('/deleteToken', deleteTokenRouter);
app.use('/user', userRouter)
app.use('/projects', projectsRouter)
app.use('/workers', workersRouter)
app.use('/tasks', tasksRouter)
app.use('/logs', logsRouter)
app.use('/workHours', workHoursRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
