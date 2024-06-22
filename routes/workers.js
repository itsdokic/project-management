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
    const id = Math.floor(Math.random() * Math.pow(10, 9));

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

            client.query('select w.id, w.first_name, w.last_name, w.email, w.number, coalesce(p.name, \' / \') as project, coalesce(concat_ws(\' \', u.first_name, u.last_name), \' / \') as supervisor, coalesce(w.hours_spent, 0) ' +
                'from workers w ' +
                'left join projects p on ' +
                'w.project = p.id ' +
                'left join users u on ' +
                'w.supervisor = u.id ' +
                'order by w.id asc;',
                (err, result) => {
                    done();

                    console.log(result.rows)

                    return res.json({data: result.rows})

                })
        }
        else if (role === "Manager") {

            client.query('select w.id, w.first_name, w.last_name, w.email, w.number, coalesce(p.name,\' / \') as project, coalesce(w.hours_spent, 0) ' +
                'from workers w ' +
                'inner join (select id, name from projects where manager = $1) as p on ' +
                'w.project = p.id ' +
                'order by w.id asc;', [id],
                (err, result) => {
                    done();

                    console.log(result.rows)

                    return res.json({data: result.rows})

                })
        }

    })

});


router.get('/addWorker/jwtAuth', authenticateToken, function(req, res, next) {

    return res.status(200);
});


router.post('/addWorker', authenticateToken, async function(req, res, next) {

    const user = req.body
    console.log(user)
    const id = generateID()
    const hashedPassword = await getHashedPassword(user.password)


    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('insert into users(id, first_name, last_name, email, number, gender, password) values($1, $2, $3, $4, $5, $6, $7);',
            [id, user.first_name, user.last_name, user.email, user.number, user.gender, hashedPassword],
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


router.post('/editWorker/getData', authenticateToken, function(req, res, next) {

    const id = req.body.id

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('select project, supervisor from workers where id = $1', [id],
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


router.post('/editWorker', authenticateToken, function(req, res, next) {

    const worker = req.body
    console.log(worker)

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('update workers set project = $1, supervisor = $2 where id = $3',
            [worker.project, worker.supervisor, worker.id],
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


router.post('/deleteWorker', authenticateToken, function(req, res, next) {

    const id = req.body.id

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('delete from workers where id = $1', [id],
            (err, result) => {
                done();

                if (err) {
                    return res.json({err})
                }

            })
    })

});

module.exports = router;