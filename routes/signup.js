var express = require('express');
var router = express.Router();
const pg = require('pg');
var passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connectionConfig = require('./connectionConfig')


const pool = connectionConfig.pool;

function getErrors(user) {

  const errors = {
    first_name: '',
    last_name: '',
    email: '',
    number: '',
    gender: '',
    password1: '',
    password2: '',
    password3: '',
    password4: '',
    error: false
  }

  if (user.first_name.length > 50) {
    errors.error = true
    errors.first_name = 'Predugačko ime'
    user.first_name = 0
  }
  else if (user.first_name.length < 2) {
    errors.error = true
    errors.first_name = 'Nevažeći unos'
    user.first_name = 0
  }
  if (user.last_name.length > 100) {
    errors.error = true
    errors.last_name = 'Predugačko prezime'
    user.last_name = 0
  }
  else if (user.last_name.length < 2) {
    errors.error = true
    errors.last_name = 'Nevažeći unos'
    user.last_name = 0
  }
  if (user.number.length > 50 || user.number.length < 9) {
    errors.error = true
    errors.number = 'Nevažeći broj telefona'
    user.number = 0
  }
  if (user.gender === '') {
    errors.error = true
    errors.gender = 'Molimo odaberite spol'
    user.gender = 0
  }

  var schema = new passwordValidator();

  schema
      .is().min(8, 'Password mora sadržavati minimalno 8 karaktera')
      .has().uppercase(1, 'Password mora sadržavati barem jedno veliko slovo')
      .has().lowercase(1, 'Password mora sadržavati barem jedno malo slovo')
      .has().digits(1, 'Password mora sadržavati barem jedan broj')

  const messages = schema.validate(user.password, { details: true });

  if(messages.length > 0) {
    user.password = 0
    errors.error = true
  }
  if (messages.length === 1) {
    errors.password1 = messages[0].message
  }
  if (messages.length === 2) {
    errors.password1 = messages[0].message
    errors.password2 = messages[1].message
  }
  if (messages.length === 3) {
    errors.password1 = messages[0].message
    errors.password2 = messages[1].message
    errors.password3 = messages[2].message
  }
  if (messages.length === 4) {
    errors.password1 = messages[0].message
    errors.password2 = messages[1].message
    errors.password3 = messages[2].message
    errors.password4 = messages[3].message
  }

  return errors;
}

async function getHashedPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
      if (err)
        reject(err)
      else
        resolve(hash)
    });
  });
}

function generateID() {
  const id = Math.floor(Math.random() * Math.pow(10, 9));

  return id;
}



router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});


router.post('/', async function(req, res, next) {
  const user = req.body
  console.log(user)
  var error = false
  var id = 0
  var hashedPassword = 0

  const errors = getErrors(user)
  console.log(errors)

  if (errors.error === true) {
    error = true
  }
  else {
    hashedPassword = await getHashedPassword(user.password)
    id = generateID()
  }

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('insert into users(id, first_name, last_name, email, number, gender, password) values($1, $2, $3, $4, $5, $6, $7);',
        [id, user.first_name, user.last_name, user.email, user.number, user.gender, hashedPassword],
        (err, result) => {
          done();
          if (err) {
              errors.email = 'Uneseni email već postoji'
              error = true
          }

          if (error === true) {
            console.log(errors)
            return res.status(400).json({errors})
          }
          else {
            const payload = {
              id: id,
              email: user.email,
              role: 'Worker'
            }

            const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
            return res.status(201).json({token})
          }

        })
  })
});

module.exports = router;
