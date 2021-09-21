const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
require('dotenv').config();

const app = express();
app.use('/static', express.static('./public'));

// connect to database
app.use((req, res, next) => {
    const dbURI = process.env.KNOTES_MONGO_URL
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => { console.log("Connection established"); next(); })
        .catch((err) => console.log(err));
})

app.use(
    (req, res, next) => {
        session({
            store: new FileStore({}),
            secret: process.env.KNOTES_SECRET,
            resave: false,
            saveUninitialized: false
        })(req, res, next)
})

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
const port = process.env.PORT || 8080
app.listen(port);
