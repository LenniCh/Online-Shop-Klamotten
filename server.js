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
