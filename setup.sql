DROP TABLE users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    brand TEXT NOT NULL
);

CREATE TABLE artikel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    preis NUMERIC NOT NULL,
    size TEXT NOT NULL,


);