const fs = require('fs');
const Note = require('../models/note');
const User = require('../models/user');

const PATH_PREFIX = './public/notes/'
const PATH_SUFFIX = '.txt'

const note_get = (req, res) => {
    if (req.session.user === undefined) {
        res.render('user/login', { title: 'Log in', message: 'Log in before you access the notes' });
    }
    else {
        console.log(req.session);
        var reads = req.session.readperm.split(':');
        if (reads.length ==0){res.render('notes/index', { title: 'Wszystkie notatki', notes: [] });}
        else if (reads.length > 0 && reads[0] == ''){res.render('notes/index', { title: 'Wszystkie notatki', notes: [] });}
        else{
            reads.pop();
        console.log(reads);
        var prom = new Promise(async(resolve, reject) => {
            var almost_notes = []
            for (const note of reads) {
                console.log(note);
                await Note.findById(note, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(result);
                        result.id = note;
                        almost_notes.push({ "id": note, "title": result.title.replace(PATH_PREFIX,'') });
                    }
                }).exec();
            }
            resolve(almost_notes)
        }).then(val => {
            console.log(val)
            res.render('notes/index', { title: 'Wszystkie notatki', notes: val });
        });
        }
        
    }
};

const note_details = (req, res) => {
    if (req.session.user === undefined) {
        res.render('user/login', { message: 'Log in before you access the notes' });
    }
    const note_id = req.params.filename;
    Note.findById(note_id, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/404');
        }
        else {
            res.render('notes/details', { name: result.title, body: result.content, title: result.title });
            console.log(result)
        }
    });
};

const note_create_get = (req, res) => {
    if (req.session.user === undefined) { res.render('user/login', { message: 'Log in before you access the notes' }); }
    res.render('notes/create', { title: 'Stwórz notatkę', exists: false });
};

const note_create_post = (req, res) => {
    if (req.session.user === undefined) { res.render('user/login', { message: 'Log in before you access the notes' }); }
    const path = PATH_PREFIX + req.body.title + PATH_SUFFIX;
    if (!fs.existsSync(path)) {
        const note = new Note({
            title: path,
            content: req.body.text
        })
        console.log(note);
        note.save()
            .then(() => console.log("success"))
            .catch((error) => console.log(error));
        //update user
        req.session.readperm = req.session.readperm + note._id + ":";
        req.session.writeperm = req.session.writeperm + note._id + ":";
        console.log("Updated read : ", req.session.readperm);
        console.log("Updated write : ", req.session.writeperm); 
        User.updateOne({ "login": req.session.user }, { "readperm": req.session.readperm, "writeperm": req.session.writeperm },
        function (err, result) {
            if (err){
                console.log(err)
                res.redirect('/');// z jakiegos powodu odswiezona sesja nie jest przekazywana dalej(w zwiazku z tym )
            }
            else{
                console.log(req.session.readperm)
                console.log("Updated User : ", result);
                res.redirect('/');// z jakiegos powodu odswiezona sesja nie jest przekazywana dalej
            }});
        
    } else {
        res.render('notes/create', { title: 'Stwórz notatkę', exists: true });
    }
};

const note_delete = (req, res) => {
    Note.deleteOne({ url: PATH_PREFIX + req.params.filename + PATH_SUFFIX }, function (error, result) {
        if (error) {
            return console.log(error);
        } else {
            console.log("deleted one record");
            res.json({ redirect: '/notes' });
        }
    })
};

const note_update = (req, res) => {
    Note.findOneAndUpdate({ url: PATH_PREFIX + req.body.title + PATH_SUFFIX },
        // {url: PATH_PREFIX + req.params.filename + PATH_SUFFIX, content: req.params.content })
        function (error, result) {
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