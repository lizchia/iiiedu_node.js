const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'T1st@localhost',
    database:'test',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});
module.exports= pool.promise();