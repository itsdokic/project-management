var express = require('express');
var router = express.Router();
const pg = require("pg");
require('dotenv').config();

const config = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.connectionPort,
    max: 100,
    idleTimeoutMillis: 3000,
}

const pool = new pg.Pool(config);

module.exports = {pool};