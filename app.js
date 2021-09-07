const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
app.use('/static', express.static('./public'));

// read config.json
app.use((req, res, next) => {
    fs.readFile('./config.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`error while reading data from config: ${err}`);
            return;
        }
        const creds = JSON.parse(data);
        req.credential = { user: creds.user, password: creds.password, secret_key: creds.secret_key };
        next();
    });
})

// connect to database
app.use((req, res, next) => {
    const { user, password } = req.credential
    const dbURI = `mongodb+srv://${user}:${password}@knotes.xks1n.mongodb.net/knotes?retryWrites=true&w=majority`;
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => { console.log("Connection established"); next(); })
        .catch((err) => console.log(err));
})

app.use(
    (req, res, next) => {
        session({
            store: new FileStore({}),
            secret: req.credential.secret_key,
            resave: false,
            saveUninitialized: false
        })(req, res, next)
})

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// use note routes
app.use('/notes', noteRoutes);
app.use('/user', userRoutes);

// render index page
app.get('/', (req, res, next) => {
    console.log(req.session); // tu sesja jest undefined
    res.render('index', { title: "Strona główna" });
    // req.session.user = 'x'; // to nie działa jak na razie
    // console.log(res.session);
});

// redirect to 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404', { title: "Nie znaleziono!" });
});

// listen to requests on port 8080
app.listen(8080);
