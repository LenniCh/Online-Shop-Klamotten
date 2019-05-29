const express = require('express');
const app = express()
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// initialize SQLite with database 'produkte.db'
const sqlite3 = require('sqlite3').verbose(); 
 
let db = new sqlite3.Database('produkte.db', (err) => {
    if (err) {
		console.error(err.message);   
	}
	 console.log('Connected to the produkte database.'); 
}); 






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
app.get("/thrasher2", function(req,res){
	let thrasher ="Thrasher"
	db.all(`SELECT * FROM produkte WHERE anbieter='${thrasher}'`, function(err, rows){
		if (err){
			console.log(err.message);
		}
		res.render('thrasher2',{'produkte':rows || []});
		
	});
});


app.use(express.static(__dirname+'/pics'));
app.use(express.static(__dirname+'/main'));