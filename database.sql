CREATE TABLE produkte ( 
    produktID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    kategorie TEXT NOT NULL,
    s TEXT NOT NULL,
    m TEXT NOT NULL,
    l TEXT NOT NULL,
    farbe TEXT NOT NULL,
    preis NUMERIC NOT NULL,
    anbieter TEXT NOT NULL,
    bild TEXT NOT NULL

    );



INSERT INTO produkte(
    name, kategorie, s, m, l, farbe, preis, anbieter, bild
)
VALUES (
    "Hoodie", "Pullover", 1, 1, 1, "grau", 35.99, "Thrasher", "thrasherhoodie.jpg"
);

create table users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    brand TEXT NOT NULL,
    banner TEXT NOT NULL);


INSERT INTO users(username, password, brand, banner) 
 VALUES("ELEMENT","1234", "ELEMENT","elementBanner.png");
