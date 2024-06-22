var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const pg = require("pg");
const bcrypt = require('bcrypt');
require('dotenv').config();
const connectionConfig = require('./connectionConfig')


const pool = connectionConfig.pool;

async function isValid(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', async function(req, res, next) {
  const user = req.body
  console.log(user)


  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('select id, email, password, role from users where email = $1;', [user.email],
        (err, result) => {
          done();

          const data = result.rows[0]

          processData(data)
        })
  })

  async function processData(data) {
    console.log(data)

    const errors = {
      email: '',
      password: ''
    }

    if (data) {
      console.log(data)
      console.log(user.password)
      console.log(data.password)
      const validatePassword = await isValid(user.password, data.password)
      console.log(validatePassword)

      if (validatePassword) {
        const payload = {
          id: data.id,
          email: data.email,
          role: data.role
        }

        const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY)
        return res.status(201).json({token})
      }
      else {
        errors.password = 'Unesena lozinka je pogrešna'
        return res.status(400).json({errors})
      }
    }
    else {
      errors.email = 'Uneseni email nije validan'
      return res.status(400).json({errors})
    }

  }

});

module.exports = router;
