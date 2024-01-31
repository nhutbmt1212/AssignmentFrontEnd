const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('HinhAnh'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    res.send(req.file);
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


app.post('/products', upload.single('HinhAnh'), (req, res) => {
    const newProduct = req.body;
    if (req.file) {
        newProduct.HinhAnh = req.file.filename;
    }

    let sql = 'INSERT INTO SANPHAM SET ?';
    db.query(sql, newProduct, (err, result) => {
        if (err) throw err;
        res.send('Product added successfully');
    });
});



app.put('/products/:id', upload.single('HinhAnh'), (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    if (req.file) {
        updatedProduct.HinhAnh = req.file.path;
    }

    let sql = 'UPDATE SANPHAM SET ? WHERE MaSanPham = ?';
    db.query(sql, [updatedProduct, productId], (err, result) => {
        if (err) throw err;
        res.send('Product updated successfully');
    });
});


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
