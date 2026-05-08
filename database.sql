CREATE DATABASE fashion_store;

USE fashion_store;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price INT,
    image TEXT
);

INSERT INTO products(name,price,image) VALUES
('Oversize Hoodie',350000,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'),
('Basic T-Shirt',150000,'https://images.unsplash.com/photo-1512436991641-6745cdb1723f'),
('Casual Jacket',500000,'https://images.unsplash.com/photo-1496747611176-843222e1e57c'),
('Cargo Pants',400000,'https://images.unsplash.com/photo-1529139574466-a303027c1d8b');