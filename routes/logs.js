var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const pg = require("pg");
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


router.post('/getData', authenticateToken, function(req, res, next) {

  const role = req.body.role
  const id = req.body.id

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    if (role === "Admin") {

      client.query('select id, worker, date, start_time, end_time from work_hours order by date desc',
          (err, result) => {
            done();

            console.log(result.rows)

            return res.json({data: result.rows})

          })
    }
    else if (role === "Manager") {

      client.query('select wh.id, wh.worker, wh.date, wh.start_time, wh.end_time ' +
          'from work_hours wh ' +
          'inner join ' +
          '(select w.id ' +
          'from workers w ' +
          'inner join (select id from projects where manager = $1) as p on ' +
          'w.project = p.id) as w on ' +
          'wh.worker = w.id ' +
          'order by date desc;', [id],
          (err, result) => {
            done();

            if (err) {
                console.log(err)
            }
            console.log(result.rows)

            return res.json({data: result.rows})

          })
    }

  })

});

module.exports = router;
