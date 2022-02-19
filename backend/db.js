const mysql = require('mysql');
require('dotenv').config({path: './config/.env'});

const con = mysql.createConnection({
    host: '',
    user: '',
    password: ''
})