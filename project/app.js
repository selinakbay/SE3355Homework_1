const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
console.log('Database Path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database at', dbPath, ':', err.message);
        process.exit(1);
    }
    console.log('Connected to the database!');
});

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    db.all('SELECT category, COUNT(*) as count FROM products GROUP BY category', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('home', { categories: rows }); 
    });
});

app.get('/search', (req, res) => {
    const query = req.query.q || '';
    db.all('SELECT * FROM products WHERE ad_no LIKE ? OR description LIKE ? OR city LIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('search', { products: rows, query });
    });
});

app.get('/product/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        res.render('detail', { product: row });
    });
});

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});
