const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.use(cors());
app.use(bodyParser.json());

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

// Add a new product
app.post('/products', (req, res) => {
    const newProduct = req.body;
    let sql = 'INSERT INTO SANPHAM SET ?';
    db.query(sql, newProduct, (err, result) => {
        if (err) throw err;
        res.send('Product added successfully');
    });
});

// Update a product
app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    let sql = 'UPDATE SANPHAM SET ? WHERE MaSanPham = ?';
    db.query(sql, [updatedProduct, productId], (err, result) => {
        if (err) throw err;
        res.send('Product updated successfully');
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    let sql = 'DELETE FROM SANPHAM WHERE MaSanPham = ?';
    db.query(sql, productId, (err, result) => {
        if (err) throw err;
        res.send('Product deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});