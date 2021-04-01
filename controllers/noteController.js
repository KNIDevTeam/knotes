const json = require('body-parser/lib/types/json');
const fs = require('fs');
const Note = require('../models/note');

const note_get = (req, res) => {
    Note.find({},(err,result)=>{
        if(err){
            console.log(err);
        }
        else
        {
            console.log(result);
        }
    });
    const filenames = fs.readdirSync('./public/notes').map(filename => {
        return filename.substr(0, filename.length - 4)
    });
    res.render('notes/index', { title: 'Wszystkie notatki', notes: filenames });
};

const note_details = (req, res) => {
    const note_url = req.params.filename;
    Note.find({url: note_url},(error,result)=>{
        if(error){
            console.log(error);
            res.redirect('/404');
        }
        else
        {
            data = result.content
            res.render('notes/details', { name: note_url, body: data, title: 'Notatka'});
        }
    });
    // try {

    //     const data = fs.readFileSync('./public/notes/' + req.params.filename + '.txt');
    //     res.render('notes/details', { name: req.params.filename, body: data, title: 'Notatka'});
    // } catch (err) {
    //     console.log(err);
    //     res.redirect('/404');
    // }
};

const note_create_get = (req, res) => {
    res.render('notes/create', { title: 'Stwórz notatkę', exists: false });
};

const note_create_post = (req, res) => {
    const path = './public/notes/' + req.body.title + '.txt';
    if(!fs.existsSync(path)) {
        const note = new Note({
            url:path,
            content:req.body.text
        })
        note.save()
        .then((result) => console.log("success"))
        .catch((err)=>console.log(err));
        //
        //fs.writeFileSync(path, req.body.text);
        // jak db dziala to do wywalenia
        res.redirect('/notes');
    } else {
        res.render('notes/create', { title: 'Stwórz notatkę', exists: true });
    }
};

const note_delete = (req, res) => {
    Note.deleteOne({url: './public/notes/' + req.params.filename + '.txt'},function(err,result) {
        if (err) return console.log(err);
       console.log("deleted one record");
    })
    //jak db działa to do wywalenia
    fs.rmSync('./public/notes/' + req.params.filename + '.txt');
    //
    res.json({ redirect: '/notes' });
};

const note_update = (req, res) => {
    console.log(req.body)
    const path = './public/notes/' + req.body.oldUrl + '.txt';

    fs.writeFileSync(path, req.body.content)
    res.redirect('/notes')
}

module.exports = {
    note_get, 
    note_details, 
    note_create_get, 
    note_create_post,
    note_delete,
    note_update
};