const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'QuanLyShopee'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM SANPHAM';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
