const express = require('express');
const app = express()
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// initialize SQLite with database 'shop.db'
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('shop.db');

// Webserver starten http://localhost:3000
app.listen(3000, function(){
	console.log("listening on 3000");
});

app.use(express.static(__dirname + '/images'));

app.get('/', (request, response) => {
	response.render('anbieter');
});

app.get('/shirts', (request, response)=>{
	response.render('shirts')
});

app.get('/pullis', (request, response)=>{
	response.render('pullis')
});

app.get('/jacken', (request, response)=>{
	response.render('jacken')
});

app.get('/hosen', (request, response)=>{
	response.render('hosen')
});

app.get('/schuhe', (request, response)=>{
	response.render('schuhe')
});

app.get('/accessoires', (request, response)=>{
	response.render('accessoires')
});
