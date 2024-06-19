const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'testdb',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database');
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table created or already exists');
    });
});

app.get('/', (req, res) => {
    const name = `User${Math.floor(Math.random() * 100)}`;
    const insertQuery = `INSERT INTO people (name) VALUES ('${name}')`;

    db.query(insertQuery, (err) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).send('Server error');
        }

        db.query('SELECT name FROM people', (err, results) => {
            if (err) {
                console.error('Error fetching from database:', err);
                return res.status(500).send('Server error');
            }

            const namesList = results.map(row => `<li>${row.name}</li>`).join('');
            res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
