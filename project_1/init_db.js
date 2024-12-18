const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database!');
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad_no TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      city TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        return;
      }
      console.log('Products table created successfully.');
    }
  );

  const products = [
    { ad_no: 'AD001', description: 'Red Chair', price: 50.0, city: 'Istanbul', image: '/images/red_chair.jpg', category: 'Furniture' },
    { ad_no: 'AD002', description: 'Blue Sofa', price: 300.0, city: 'Ankara', image: '/images/blue_sofa.jpg', category: 'Furniture' },
    { ad_no: 'AD003', description: 'Smartphone', price: 700.0, city: 'Izmir', image: '/images/smartphone.jpg', category: 'Electronics' },
    { ad_no: 'AD004', description: 'Mountain Bike', price: 200.0, city: 'Bursa', image: '/images/bike.jpg', category: 'Sports' },
    { ad_no: 'AD005', description: 'Dining Table', price: 150.0, city: 'Antalya', image: '/images/dining_table.jpg', category: 'Furniture' },
    { ad_no: 'AD006', description: 'Laptop', price: 1000.0, city: 'Istanbul', image: '/images/laptop.jpg', category: 'Electronics' },
    { ad_no: 'AD007', description: 'Basketball', price: 30.0, city: 'Adana', image: '/images/basketball.jpg', category: 'Sports' },
    { ad_no: 'AD008', description: 'Washing Machine', price: 400.0, city: 'Konya', image: '/images/washing_machine.jpg', category: 'Home Appliances' },
    { ad_no: 'AD009', description: 'Bookshelf', price: 75.0, city: 'Istanbul', image: '/images/bookshelf.jpg', category: 'Furniture' },
    { ad_no: 'AD010', description: 'TV', price: 600.0, city: 'Izmir', image: '/images/tv.jpg', category: 'Electronics' },
  ];

  const insertStmt = db.prepare(
    `INSERT INTO products (ad_no, description, price, city, image, category) VALUES (?, ?, ?, ?, ?, ?)`
  );

  products.forEach((product) => {
    insertStmt.run(
      product.ad_no,
      product.description,
      product.price,
      product.city,
      product.image,
      product.category,
      (err) => {
        if (err) {
          console.error(`Error inserting product ${product.ad_no}:`, err.message);
        }
      }
    );
  });

  insertStmt.finalize((err) => {
    if (err) {
      console.error('Error finalizing insert statement:', err.message);
    } else {
      console.log('All products have been successfully inserted.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
