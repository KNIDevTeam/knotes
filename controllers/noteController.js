const fs = require('fs');
const { url } = require('inspector');
const Note = require('../models/note');

const PATH_PREFIX = './public/notes/'
const PATH_SUFFIX = '.txt'

const note_get = (req, res) => {
    Note.find({}, (error, result) => {
        if (error) {
            console.log(error);
        }
        else
        {
            console.log(result);
            var filenames = []
            for (var i = 0; i < result.length; i++) {
                filenames.push(result[i].url.replace(PATH_PREFIX,'').replace(PATH_SUFFIX,''))
            }
            res.render('notes/index', { title: 'Wszystkie notatki', notes: filenames });
        }
    });
};

const note_details = (req, res) => {
    const note_url = req.params.filename;
    Note.findOne({url: PATH_PREFIX + note_url + ".txt"}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/404');
        }
        else
        {
            res.render('notes/details', { name: note_url, body: result.content, title: 'Notatka'});
            console.log(result)
        }
    });
};

const note_create_get = (req, res) => {
    res.render('notes/create', { title: 'Stwórz notatkę', exists: false });
};

const note_create_post = (req, res) => {
    const path = PATH_PREFIX + req.body.title + PATH_SUFFIX;
    if (!fs.existsSync(path)) {
        const note = new Note({
            url: path,
            content: req.body.text
        })
        note.save()
        .then(() => console.log("success"))
        .catch((error) => console.log(error));
        res.redirect('/notes');
    } else {
        res.render('notes/create', { title: 'Stwórz notatkę', exists: true });
    }
};

const note_delete = (req, res) => {
    Note.deleteOne({url: PATH_PREFIX + req.params.filename + PATH_SUFFIX}, function(error, result) {
        if (error) {
            return console.log(error);
        } else {
            console.log("deleted one record");
            res.json({ redirect: '/notes' });
        }
    })
};

const note_update = (req, res) => {
    Note.findOneAndUpdate({url: PATH_PREFIX + req.body.title + PATH_SUFFIX}, 
        // {url: PATH_PREFIX + req.params.filename + PATH_SUFFIX, content: req.params.content })
        function(error, result) {        
        if (error) {
            console.log(error);
        } else {
            console.log(req)
            result = { url: req.body.filename, content: req.body.content }
        }
        res.redirect('/notes')
    })
};

module.exports = {
    note_get, 
    note_details, 
    note_create_get, 
    note_create_post,
    note_delete,
    note_update
};