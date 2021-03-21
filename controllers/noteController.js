const fs = require('fs');

const note_get = (req, res) => {
    const filenames = fs.readdirSync('./public/notes').map(filename => {
        return filename.substr(0, filename.length - 4)
    });
    res.render('notes/index', { title: 'Wszystkie notatki', notes: filenames });
};

const note_details = (req, res) => {
    try {
        const data = fs.readFileSync('./public/notes/' + req.params.filename + '.txt');
        res.render('notes/details', { name: req.params.filename, body: data, title: 'Notatka'});
    } catch (err) {
        console.log(err);
        res.redirect('/404');
    }
};

const note_create_get = (req, res) => {
    res.render('notes/create', { title: 'Stwórz notatkę', exists: false });
};

const note_create_post = (req, res) => {
    const path = './public/notes/' + req.body.title + '.txt';
    if(!fs.existsSync(path)) {
        fs.writeFileSync(path, req.body.text);
        res.redirect('/notes');
    } else {
        res.render('notes/create', { title: 'Stwórz notatkę', exists: true });
    }
};

const note_delete = (req, res) => {
    fs.rmSync('./public/notes/' + req.params.filename + '.txt');
    res.json({ redirect: '/notes' });
};

const note_update = (req, res) => {
    const path = './public/notes/' + req.body.name + '.txt';
}

module.exports = {
    note_get, 
    note_details, 
    note_create_get, 
    note_create_post,
    note_delete,
    note_update
};