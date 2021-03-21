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

//Listen to requests on port 8080
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
