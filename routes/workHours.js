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

function generateID() {
  const id = Math.floor(Math.random() * Math.pow(10, 3));

  return id;
}



router.post('/addWorkHours', authenticateToken, function(req, res, next) {

  const workerID = req.body.id
  const workStartTime = req.body.workStartTime
  const workEndTime = req.body.workEndTime
  const timeDifferenceH = req.body.timeDifferenceH
  const date = req.body.date
  const id = generateID()

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('update workers set hours_spent = hours_spent + $1 where id = $2',
        [timeDifferenceH, workerID],
        (err, result) => {

          if (err) {
            done();
            return res.json({err})
          }

        })

    client.query('insert into work_hours (id, worker, date, start_time, end_time) values ($1, $2, $3, $4, $5)',
        [id, workerID, date, workStartTime, workEndTime],
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


router.post('/workerGetData', authenticateToken, function(req, res, next) {

  const workerID = req.body.id;

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err);
    }

    client.query('select hours_spent from workers where id = $1', [workerID], (err, result1) => {
      if (err) {
        done();
        return res.json({ err });
      }

      const hours_spent = result1.rows[0];

      client.query('select id, date, start_time, end_time from work_hours where worker = $1 order by date desc', [workerID], (err, result2) => {
        done();

        if (err) {
          return res.json({ err });
        }
        else {
          const work_hours = result2.rows;
          return res.json({ hours_spent, work_hours });
        }
      });
    });
  });
});

module.exports = router;
