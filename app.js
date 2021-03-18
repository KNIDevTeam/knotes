const express = require('express');
const morgan = require('morgan');

const noteRoutes = require('./routes/noteRoutes');

//Init express app
const app = express();

//Set view engine to ejs
app.set('view engine', 'ejs');

//Set static files path
app.use(express.static('public'));

//Set extended url encoding
app.use(express.urlencoded({ extended:true }));

//Morgan
app.use(morgan('dev'));

//Listen to requests on port 3000
app.listen(3000);

//Render index page
app.get('/', (req, res) => {
    res.render('index', { title: "Strona główna" });
});

//Use note routes
app.use('/notes', noteRoutes);

//Redirect to 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404', { title: "Nie znaleziono!" });
});

