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


db.each('SELECT * FROM produkte', (err, row) => {
	const produktID = row.produktID;     
	const name = row.name;    
	const preis = row.preis; 
});




INSERT INTO produkte(
    name, kategorie, s, m, l, farbe, preis, anbieter, bild
)
VALUES (
    Hoodie, Pullover, 1, 1, 1, grau, 35.99, Thrasher, thrasherhoodie.jpg
);