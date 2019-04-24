let users = [
    {name: 'Alice' , passw: ':;<=>?@AB'},
    {name: 'Bob' , passw: 'seret'},
    {name: 'Carla' , passw: '123'},
    {name: 'David' , passw: 'divaD'}
]
let benutzername = 'Alice';
let passwort = ':;<=>?@AB';
function login(benutzername, passwort){
    for(elem of users){
        if(benutzername == elem.name && passwort == elem.passw){
            console.log('Anmeldung erfolgreich');
        }else if(benutzername == elem.name && passwort != elem.passw){
                console.log('Anmeldung fehlgeschlagen');
                console.log('falsches Passwort');
            }
        }
    }