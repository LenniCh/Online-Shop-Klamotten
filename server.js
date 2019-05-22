const express = require('express');
const app = express();

app.use(express.static(__dirname + '/stylings'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/public'));

const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const sqlite3 = require('sqlite3').verbose();
let database = new sqlite3.Database('users.db'); 

const bcrypt = require('bcrypt');
const saltRounds = 8;

app.listen(3000, () => {
    console.log("Server is listening on 3000");

    database.each(`SELECT * FROM users`, (error, row) => {
        console.log(row);
    });
});




app.get('/', (request, response) => {
    let authenticated = request.session.authenticated;
    let username = request.session.username;

    let greeting;
    if (!authenticated) {
        greeting = "Willkommen!";
    }
    else {
        greeting = `Willkommen, ${username}!`;
    }

    response.render('index', {
        isLoggedIn: authenticated,
        greeting: greeting
    });
});

app.get('/artikel', (request, response) => {
    if (!request.session.authenticated) {
        response.render('artikel', {
            error: false
        });
    }
    else {
        response.redirect('/');
    }
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

    database.get(`SELECT * FROM users WHERE username='${username}'`, function(error, row) {
        if (error) {
            console.log(error);
            response.redirect('/login');
            return;
        }

        if (row != null) {
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
                }
                else {
                    response.render('login', {
                        error: true
                    });
                }
            });
        } 
        else {
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
    }
    else {
        response.redirect('/');
    }
});

app.post('/register', (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    let passwordConfirm = request.body.passwordConfirm;
    
    if (password != passwordConfirm) {
        response.render('register', {
            error: "Passwörter müssen übereinstimmen!"
        });
        return;
    }

    database.get(`SELECT * FROM users WHERE username='${username}'`, function(error, row) {
        if (error) {
            console.log(error);
            response.redirect('/register');
            return;
        }

        if (row == null) {
            bcrypt.hash(password, saltRounds, (error, hash) => {
                if (error) {
                    console.log(error);
                    response.redirect('/register');
                    return;
                }

                database.run(`INSERT INTO users (username, password) VALUES ('${username}', '${hash}')`, (error) => {
                    if (error) {
                        console.log(error);
                        response.redirect('/register');
                        return;
                    }
                });
                console.log(`User '${username} registered`);
                request.session.authenticated = true;
                request.session.username = username;
                response.redirect('/');
            });
        }
        else {
            response.render('register', {
                error: "Benutzername bereits vorhanden."
            });
        }
    });
});