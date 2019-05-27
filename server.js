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

app.get("/bs", function(req,res){
	res.render('bs');
});
app.get("/pullover", function(req,res){
	res.render('pullover');
});
app.get("/thrasher", function(req,res){
	res.render('thrasher');
});
app.use(express.static(__dirname+'/pics'));