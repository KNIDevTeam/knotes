require('dotenv').config()

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

app.use((req, res, next) => {
    const dbURI = process.env.KNOTES_MONGO_URL
    //connect to db
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => { console.log("Connection established"); next(); })
        .catch((err) => console.log(err));
})

app.use(
    (req, res, next) => {
        session({
            store: new FileStore(fileStoreOptions),
            secret: process.env.KNOTES_SECRET,
            resave: false,
            saveUninitialized: false
        })(req, res, next)
    });

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');


//Set view engine to ejs
app.set('view engine', 'ejs');

//Set static files path
app.use(express.static('public'));



//Set extended url encoding
app.use(express.urlencoded({ extended: true }));

//Morgan
app.use(morgan('dev'));



//Render index page
app.get('/', (req, res, next) => {
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

const port = process.env.PORT || 8080
app.listen(port);
