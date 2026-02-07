const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',      // put your MySQL password if you have one
  database: 'eportfolio'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

module.exports = db;
