const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const session = require('express-session');
var FileStore = require('session-file-store')(session);


var fileStoreOptions = {};
//Init express app
const app = express();
let secret_key


app.use( (req,res,next)=>{
    fs.readFile('./config.json', 'utf8', (err,data)=>{
        if(err){
            console.log('error while reading data from config: ${err} ');
            return;
        }
        //console.log(data);
        const creds = JSON.parse(data);
        req.credential={user:creds.user, password:creds.password, secret_key:creds.secret_key};
        // req.credential.user  = creds.user;
        // req.credential.password  = ;
        // req.credential.secret_key=creds.secret_key;
        next();
        
        

    });
})

app.use((req,res,next)=>{
    //console.log(`mongodb+srv://${user}:${password}@knotes.xks1n.mongodb.net/knotes?retryWrites=true&w=majority`);
    const {user, password}=req.credential
    console.log(req.credential)
    const dbURI = `mongodb+srv://${user}:${password}@knotes.xks1n.mongodb.net/knotes?retryWrites=true&w=majority`;
        //connect to db
        mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then((result )=>{console.log("Connection established");next();})
        .catch((err )=>console.log(err));
})

app.use(
    (req,res,next)=>{
        console.log(req.credential)
        session({
        store: new FileStore(fileStoreOptions),
        secret: req.credential.secret_key,
        resave: false,
        saveUninitialized: false
        })(req,res,next)
});

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');


//Set view engine to ejs
app.set('view engine', 'ejs');

//Set static files path
app.use(express.static('public'));



//Set extended url encoding
app.use(express.urlencoded({ extended:true }));

//Morgan
app.use(morgan('dev'));



//Render index page
app.get('/', (req, res,next) => {
    console.log(req.session);//tu sesja jest undefined
    res.render('index', { title: "Strona główna" });
    //req.session.user='x'; to nie działa jak na razie
});

//Use note routes
app.use('/notes', noteRoutes);
app.use('/user', userRoutes);
//Redirect to 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404', { title: "Nie znaleziono!" });
});

app.listen(8080);
//Listen to requests on port 8080
// const PORT = process.env.PORT || 8080
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
