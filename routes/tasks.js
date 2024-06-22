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



router.post('/getData', authenticateToken, function(req, res, next) {

    const role = req.body.role
    const id = req.body.id

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    if (role === "Admin") {

        client.query('select t.project_id, t.id, t.name, t.end_date, t.status, concat_ws(\' \', w.first_name, w.last_name) as responsible_worker ' +
            'from tasks t ' +
            'left join workers w on ' +
            't.responsible_worker = w.id ' +
            'order by t.project_id ASC',
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }
    else if (role === "Manager") {

        client.query('select t.project_id, t.id, t.name, t.end_date, t.status, concat_ws(\' \', w.first_name, w.last_name) as responsible_worker ' +
            'from tasks t ' +
            'left join workers w on ' +
            't.responsible_worker = w.id ' +
            'inner join (select id from projects where manager = $1) as p on ' +
            't.project_id = p.id ' +
            'order by t.project_id ASC', [id],
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }
    else if (role === "Worker") {

        client.query('select t.id, t.name, t.end_date, t.status ' +
            'from tasks t ' +
            'inner join (select project from workers where id = $1) as w on ' +
            't.project_id = w.project ' +
            'where t.responsible_worker = $1 ' +
            'order by t.id ASC;', [id],
            (err, result) => {
                done();

                console.log(result.rows)

                return res.json({data: result.rows})

            })
    }

  })

});


router.get('/addTask/jwtAuth', authenticateToken, function(req, res, next) {
    return res.status(200)
});


router.post('/addTask', authenticateToken, function(req, res, next) {


  const task = req.body
  const id = generateID()
    if (task.responsible_worker === "") {
        task.responsible_worker = null;
    }

  pool.connect((err, client, done) => {
    if (err) {
      return res.send(err)
    }

    client.query('insert into tasks (id, project_id, name, end_date, responsible_worker) values ($1, $2, $3, $4, $5)',
        [id, task.project_id, task.name, task.end_date, task.responsible_worker],
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


router.post('/editTask/getData', authenticateToken, function(req, res, next) {

    const id = req.body.id

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('select project_id, name, end_date, responsible_worker from tasks where id = $1', [id],
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


router.post('/editTask', authenticateToken, function(req, res, next) {

    const task = req.body

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('update tasks set project_id = $1, name = $2, end_date = $3, responsible_worker = $4 where id = $5',
            [task.project_id, task.name, task.end_date, task.responsible_worker, task.id],
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


router.post('/deleteTask', authenticateToken, function(req, res, next) {

    const id = req.body.id

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('delete from tasks where id = $1', [id],
            (err, result) => {
                done();

                if (err) {
                    return res.json({err})
                }

            })
    })

});


router.post('/endTask', authenticateToken, function(req, res, next) {

    const id = req.body.id
    const taskStatus = 'Završen'
    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('update tasks set status = $1 where id = $2', [taskStatus, id],
            (err, result) => {
                done();

                if (err) {
                    console.log(err)
                    return res.json({err})
                }

            })
    })

});


module.exports = router;
