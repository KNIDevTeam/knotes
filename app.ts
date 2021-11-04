import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
const FileStore = require('session-file-store')(session);
import bodyParser from 'body-parser';
require('dotenv').config();

declare module 'express-session' {
    export interface SessionData {
        user: string,
        readperm: string,
        writeperm: string;
    }
}

const app = express();
app.use('/static', express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to database
app.use((req, res, next) => {
    if (process.env.KNOTES_MONGO_URL !== undefined) {
        const dbURI: string = process.env.KNOTES_MONGO_URL
        mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
            .then((result) => { console.log("Connection established"); next(); })
            .catch((err) => console.log(err));
    }
    else
        throw("URL of Mongo DB was not found in .env file")
})

app.use(
    (req, res, next) => {
        if (process.env.KNOTES_SECRET !== undefined) {
            session({
                store: new FileStore({}),
                secret: process.env.KNOTES_SECRET,
                resave: false,
                saveUninitialized: false
            })(req, res, next)
        }
        else
            throw("Secret of Mongo DB was not found in .env file") 
    }
)

// use note routes
app.use('/notes', require('./routes/noteRoutes'));
app.use('/user', require('./routes/userRoutes'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// render index page
app.get('/', (req, res, next) => {
    console.log(req.session); // tu sesja jest undefined
    res.render('index', {title: "Strona główna", loged_in: req.session.user !== undefined});
    // req.session.user = 'x'; // to nie działa jak na razie
    // console.log(res.session);
});

// redirect to 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404', {title: "Not found!", loged_in: req.session.user !== undefined});
});

// redirect to 500 page
app.use((req, res) => {
    res.status(500);
    res.render('500', {title: "Something went wrong!", loged_in: req.session.user !== undefined});
});

// listen to requests on port 8080
const port = process.env.PORT || 8080
app.listen(port);
