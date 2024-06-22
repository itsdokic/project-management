var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const pg = require("pg");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connectionConfig = require('./connectionConfig')


const pool = connectionConfig.pool;

function authenticateToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log(token)

  if (token === undefined || token === "null") {
    const error = {message: "Nemate dozvolu za pristup"}
    return res.status(401).send(error.message);
  }

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.json({error: "Nevažeći token"})
    }

    next()
  })

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
  const id = Math.floor(Math.random() * Math.pow(10, 3));

  return id;
}



router.post('/getData', authenticateToken, function(req, res, next) {

    const role = req.body.role
    const id = req.body.id

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    if (role === "Admin") {

        client.query('select p.id, p.name, p.start_date, p.end_date, concat_ws(\' \', u.first_name, u.last_name) as manager, description ' +
            'from projects p ' +
            'inner join users u on ' +
            'p.manager = u.id ' +
            'order by id ASC',
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }
    else if (role === "Manager") {

        client.query('select p.id, p.name, p.start_date, p.end_date, description ' +
            'from projects p ' +
            'inner join users u on ' +
            'p.manager = u.id ' +
            'where p.manager = $1 ' +
            'order by id ASC', [id],
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }
    else if (role === "Worker") {

        client.query('select p.id, p.name, p.start_date, p.end_date, concat_ws(\' \', u.first_name, u.last_name) as manager, description ' +
            'from projects p ' +
            'inner join users u on ' +
            'p.manager = u.id ' +
            'inner join (select project from workers where id = $1) as w on ' +
            'p.id = w.project;', [id],
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }
  })

});


router.get('/addProject/jwtAuth', authenticateToken, function(req, res, next) {

  return res.status(200)
});


router.post('/addProject', authenticateToken, function(req, res, next) {

  const project = req.body
  const id = generateID()

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('update users set role = \'Manager\' where id = $1',
        [project.manager],
        (err, result) => {

            if (err) {
                done();
                console.log(err)
                return res.json({err})
            }

        })

    client.query('insert into projects (id, name, start_date, end_date, manager, description) values ($1, $2, $3, $4, $5, $6)',
        [id, project.name, project.start_date, project.end_date, project.manager, project.description],
        (err, result) => {
          done();

          if (err) {
            return res.json({err})
          }
          else {
            return res.json({message: 'successful'})
          }

        })
  })

});


router.post('/editProject/getData', authenticateToken, function(req, res, next) {

  const id = req.body.id

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('select id, name, start_date, end_date, manager, description from projects where id = $1', [id],
        (err, result) => {
          done();

          if (err) {
            return res.json({err})
          }
          else {
            return res.json({data: result.rows})
          }

        })
  })

});


router.post('/editProject', authenticateToken, function(req, res, next) {

  const project = req.body

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('update projects set name = $1, start_date = $2, end_date = $3, manager = $4, description = $5 where id = $6',
        [project.name, project.start_date, project.end_date, project.manager, project.description, project.id],
        (err, result) => {
          done();

          if (err) {
            console.log(err)
            return res.json({err})
          }
          else {
            return res.json({message: 'successful'})
          }

        })
  })

});


router.post('/deleteProject', authenticateToken, function(req, res, next) {

  const id = req.body.id

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('delete from projects where id = $1', [id],
        (err, result) => {
          done();

          if (err) {
            return res.json({err})
          }

        })
  })

});

module.exports = router;
