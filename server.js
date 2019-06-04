const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 8;

const fs = require('fs');

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// initialize SQLite with database 'produkte.db'
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('produkte.db', (err) => {
	if(err) {
		console.error(err.message);
	}
	console.log('Connected to the produkte database.');
});

// Webserver starten http://localhost:3000
app.listen(3000, function(){
	console.log("listening on 3000");
});

app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/stylings'));

// Session initilialisieren
const session = require('express-session');
app.use(session({
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

app.get('/', (request, response) => {
	let authenticated = request.session.authenticated;
	let username = request.session.username;
	var sessionVariable = request.session.authenticated;
	
	let greeting;
	
	if (!authenticated) {
		greeting = "Willkommen!";
	} else {
		greeting = `Willkommen, ${username}!`;
	}
	db.all(`SELECT * FROM users WHERE id > 0`, function(err, rows){
		if (err){
			console.log(err.message);
		}

	response.render('home', {
		isLoggedIn: authenticated,
		greeting: greeting,
		sessionVariable: request.session.authenticated,
		'anbieter':rows || []
	});
});
});

app.get('/login', (request, response) => {

    if (!request.session.authenticated) {
        response.render('login', {
            error: false
        });
    }
    else {
        response.redirect('/');
    }
});

app.post('/login', (request, response) => {
	let username = request.body.username;
	let password = request.body.password;

	db.get(`SELECT * FROM users WHERE username='${username}'`, function(error, row) {
		if(error) {
			console.log(error);
			response.redirect('/login');
			return;
		}

		if(row != null) {
			bcrypt.compare(password, row.password, (error, result) => {
				if (error) {
					console.log(error);
					response.redirect('/login');
					return;
				}

				if (result == true) {
					request.session.authenticated = true;
					request.session.username = row.username;
					response.redirect('/');
				} else {
					response.render('login', {
						error: true
					});
				}
			});
		} else {
			response.render('login', {
				error: true
			});
		}
	});
});

app.post('/logout', (request, response) => {
	request.session.destroy();
	response.redirect('/');
});

app.get('/register', (request, response) => {
	if (!request.session.authenticated) {
		response.render('register', {
			error: null
		});
	} else {
		response.redirect('/');
	}
});

app.post('/register', (request, response) => {
	let username = request.body.username;
	let password = request.body.password;
	let passwordConfirm = request.body.passwordConfirm;
	let brand = request.body.Markenname;
	let banner = request.body.banner;

	if (password != passwordConfirm) {
		response.render('register', {
			error: "Passwörter müssen übereinstimmen!"
		});
		return;
	}

	db.get(`SELECT * FROM users WHERE username='${username}'`, function(error, row) {
		if (error) {
			console.log(error);
			response.redirect('/register');
			return;
		}

		if(row == null) {
			bcrypt.hash(password, saltRounds, (error, hash) => {
				if (error) {
					console.log(error);
					response.redirect('/register');
					return;
				}

				db.run(`INSERT INTO users (username, password, brand, banner) VALUES ('${username}', '${hash}','${brand}','${banner}')`, (error) => {
					if (error) {
						console.log(error);
						response.redirect('/register');
						return;
					}
				});
				console.log(`User '${username}' registered`);
				request.session.authenticated = true;
				request.session.username = username;
				response.redirect('/');
			});
		} else {
			response.render('register', {
				error: "Benutzername bereits vorhanden."
			});
		}
	});
});

/*
app.post('/addprod', (request, response) => {
	let name = request.body.name;
	let kategorie = request.body.kategorie;
	let s = request.body.s;
	let m = request.body.m;
	let l = request.body.l;
	let farbe = request.body.farbe;
	let preis = request.body.preis;
	let anbieter = request.session.username;
	let bild = request.body.bildlink;
	let beschreibung = request.body.beschreibung;
	console.log(name);
	console.log(kategorie);
	console.log(s);
	console.log(m);
	console.log(l);
	console.log(farbe);
	console.log(preis);
	console.log(anbieter);
	console.log(bild);
	console.log(beschreibung);

	db.run(`INSERT INTO produkte (name, kategorie, s, m, l, farbe, preis, anbieter, bild, beschreibung) VALUES ('${name}', '${kategorie}', '${s}', '${m}', '${l}', '${farbe}', '${preis}', '${anbieter}', '${bild}', '${beschreibung}')`, (error) => {
	
		db.all(`SELECT * FROM users WHERE id > 0`, function(err, rows){
			response.render('home', {
				'anbieter':rows || []
			});
});
});
});
*/
				

// Versuchsfunktion zum checken ob Session aktiv
/* function sessionCheck(request, response) {
	if(request.session.authenticated == false) {
		response.render('navbar');
		console.log("render navbar");
	} else {
		response.render('sessionnavbar');
		response.render('addproduct');
		console.log("render sessionnavbar");
	}
} */

app.get("/element", function(request,response){
	var sessionVariable = request.session.authenticated;
	let element ="ELEMENT"
	db.all(`SELECT * FROM produkte WHERE anbieter='${element}'`, (err, rows) => {
		if (err){
			console.log(err.message);
		}

		response.render('element',{'produkte' :rows || [], 
			sessionVariable: request.session.authenticated
		});
	});
	});

	app.get("/element", function(request,response){
		var sessionVariable = request.session.authenticated;
		let element ="ELEMENT"
		db.all(`SELECT * FROM produkte WHERE anbieter='${element}'`, function(err, rows){
			if (err){
				console.log(err.message);
			}
			response.render('element', {
				'produkte':rows || [],
				sessionVariable: request.session.authenticated
			});
			
		});
	});

// addproduct-Formular auswerten
app.post("/addProduct", function(request, response){
	// const produktID = AUTOINCREMET PRIMARY KEY
	const name = request.body.name;
	const kategorie = request.body.kategorie;
	const s = request.body.s;
	const m = request.body.m;
	const l = request.body.l;
	const farbe = request.body.farbe;
	const preis = request.body.preis;
	const anbieter = request.session.username;
	const bild = request.body.bildlink;
	const beschreibung = request.body.beschreibung;
	console.log(name);
	console.log(kategorie);
	console.log(s);
	console.log(m);
	console.log(l);
	console.log(farbe);
	console.log(preis);
	console.log(anbieter);
	console.log(bild);
	console.log(beschreibung);


	// Datensatz in Tabelle produkte einfügen
	const sql = `INSERT INTO produkte (name, kategorie, s, m, l, farbe, preis, anbieter, bild, beschreibung) 
		VALUES ('${name}', '${kategorie}', '${s}', '${m}', '${l}', '${farbe}', '${preis}', '${anbieter}', '${bild}', '${beschreibung}')`;
	console.log(sql);
	db.run(sql, function(err){
		response.redirect("/element");
	});
	 
});

app.get('/anbieter', (request, response) => {
	var sessionVariable = request.session.authenticated;
	response.render('anbieter', {
		sessionVariable: request.session.authenticated
	});
});

app.get('/navbar', (request, response) => {
	var sessionVariable = request.session.authenticated;
	response.render('navbar', {
		sessionVariable: request.session.authenticated
	});
});

app.get('/artikel', (request, response) => {
	var sessionVariable = request.session.authenticated;
	response.render('artikel', {
		sessionVariable: request.session.authenticated
	});
});

app.get("/shirts", function(request,response){
	var sessionVariable = request.session.authenticated;
	let shirts ="T-Shirts"
	db.all(`SELECT * FROM produkte WHERE kategorie='${shirts}'`, function(err, rows){
		if (err){
			console.log(err.message);
		}
		response.render('shirts', {
			'produkte':rows || [],
			sessionVariable: request.session.authenticated
		});
		
	});
});


app.get("/pullis", function(request,response){
	var sessionVariable = request.session.authenticated;
	let pullover ="Pullover"
	db.all(`SELECT * FROM produkte WHERE kategorie='${pullover}'`, function(err, rows){
		if (err){
			console.log(err.message);
		}
		response.render('pullis', {
			'produkte':rows || [],
			sessionVariable: request.session.authenticated
		});
		
	});
});

app.get('/jacken', (request, response)=>{
	var sessionVariable = request.session.authenticated;
	response.render('jacken', {
		sessionVariable: request.session.authenticated
	});
});

app.get('/hosen', (request, response)=>{
	var sessionVariable = request.session.authenticated;
	response.render('hosen', {
		sessionVariable: request.session.authenticated
	});
});

app.get('/schuhe', (request, response)=>{
	var sessionVariable = request.session.authenticated;
	response.render('schuhe', {
		sessionVariable: request.session.authenticated
	});
});

app.get('/accessoires', (request, response)=>{
	var sessionVariable = request.session.authenticated;
	response.render('accessoires', {
		sessionVariable: request.session.authenticated
	});
});

app.get("/thrasher", function(request,response){
	var sessionVariable = request.session.authenticated;
	response.render('thrasher', {
		sessionVariable: request.session.authenticated
	});
});

app.get("/thrasher2", function(request,response){
	var sessionVariable = request.session.authenticated;
	let thrasher ="Thrasher"
	db.all(`SELECT * FROM produkte WHERE anbieter='${thrasher}'`, function(err, rows){
		if (err){
			console.log(err.message);
		}
		response.render('thrasher2', {
			'produkte':rows || [],
			sessionVariable: request.session.authenticated
		});
		
	});
});


app.get("/elementShirt", function(request,response){
	var sessionVariable = request.session.authenticated;
	let shirt ="Shirt"
	db.all(`SELECT * FROM produkte WHERE name='${shirt}'`, function(err, rows){
		if (err){
			console.log(err.message);
		}
		response.render('elementShirt', {
			'produkte':rows || [],
			sessionVariable: request.session.authenticated
		});
		
	});
});
app.get("/addproduct", function(request,response){
	var sessionVariable = request.session.authenticated;
	response.render('addproduct', {
		sessionVariable: request.session.authenticated
	});
});

app.get("/addprod", function(request,response){
	var sessionVariable = request.session.authenticated;
	response.render('addprod', {
		sessionVariable: request.session.authenticated
	});
});