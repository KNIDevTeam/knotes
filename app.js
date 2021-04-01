const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

//Init express app
const app = express();

const cfgfile = fs.readFile('./config.json', 'utf8', (err,data)=>{
    if(err){
        console.log('error while reading data from config: ${err} ');
    }else{
        //console.log(data);
        const creds = JSON.parse(data);
        const user = creds.user;
        const password = creds.password;
        //console.log(`mongodb+srv://${user}:${password}@knotes.xks1n.mongodb.net/knotes?retryWrites=true&w=majority`);

        const dbURI = `mongodb+srv://${user}:${password}@knotes.xks1n.mongodb.net/knotes?retryWrites=true&w=majority`;
        //connect to db
        mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then((result )=>{console.log("Connection established"); app.listen(8080);})
        .catch((err )=>console.log(err));
    }
});

const noteRoutes = require('./routes/noteRoutes');



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
// const PORT = process.env.PORT || 8080
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
