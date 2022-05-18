const mysql = require('mysql2')

// Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: process.env.DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = pool