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


router.post('/', authenticateToken, function(req, res, next) {

    const id = req.body.userID

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        client.query('select id, first_name, last_name, email, number, gender, role from users where id = $1', [id],
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

router.post('/edit', authenticateToken, async function(req, res, next) {

    const user = req.body
    const hashedPassword = await getHashedPassword(user.password)
    console.log(user)

    pool.connect((err, client, done) => {
        if (err) {
            return res.send(err)
        }

        if (user.password === "********") {

            client.query('update users set first_name = $1, last_name = $2, email = $3, number = $4 where id = $5',
                [user.first_name, user.last_name, user.email, user.number, user.id],
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
        }
        else {

            client.query('update users set first_name = $1, last_name = $2, email = $3, number = $4, password = $5 where id = $6',
                [user.first_name, user.last_name, user.email, user.number, hashedPassword, user.id],
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
        }

    })

});

module.exports = router;