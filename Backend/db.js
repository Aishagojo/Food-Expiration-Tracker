// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',         // Your database host
    user: 'root',              // Your MySQL username
    password: '7878', // Your MySQL password
    database: 'Food_tracker'   // Your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = connection;
