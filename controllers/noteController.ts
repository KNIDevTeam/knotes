import { NoteModel, Note } from '../models/note';
import { UserModel } from '../models/user';
import { Request, Response } from 'express';

const PATH_PREFIX = './public/notes/'
const PATH_SUFFIX = '.txt'

const note_get = (req: Request, res: Response) => {
    if (req.session.user === undefined) {
        res.render('user/login', {title: 'Log in', loged_in: false, message: 'Log in before you access the notes'});
    } else {
        var reads: string[]
        if (req.session.readperm === undefined) {
            res.render('notes/index', {title: 'Wszystkie notatki', loged_in: true, notes: []});
            return
        }
        else
            reads = req.session.readperm.split(':');
        if (reads.length === 0 || (reads.length > 0 && reads[0] === '')) {
            res.render('notes/index', {title: 'Wszystkie notatki', loged_in: true, notes: []});
        } else {
            if (reads[reads.length-1] === '')
                reads.pop();
            const prom = new Promise(async (resolve, reject) => {
                var almost_notes = []
                for (const note of reads) {
                    const mongo_note = await NoteModel.findById(note);
                    if (mongo_note !== null)
                        almost_notes.push({"id": mongo_note.id, "title": mongo_note.title.replace(PATH_PREFIX, '')});
                }
                resolve(almost_notes)
            }).then(val => {
                res.render('notes/index', {title: 'Wszystkie notatki', loged_in: true, notes: val});
            });
        }
    }
};

const note_details = (req: Request, res: Response) => {
    if (req.session.user === undefined) {
        res.render('user/login', {title: 'Log in', loged_in: false, message: 'Log in before you access the notes'});
    }
    const note_id = req.params.filename;
    NoteModel.findById(note_id, (error: any, result: Note) => {
        if (error) {
            console.log(error);
            res.redirect('/500');
        } else {
            res.render('notes/details', {title: result.title, loged_in: true, name: result.title, body: result.content});
            console.log(result)
        }
    });
};

const note_create_get = (req: Request, res: Response) => {
    if (req.session.user === undefined) {
        res.render('user/login', {title: 'Log in', loged_in: false, message: 'Log in before you access the notes'});
    }
    res.render('notes/create', {title: 'Stwórz notatkę', loged_in: true, exists: false});
};

const note_create_post = (req: Request, res: Response) => {
    if (req.session.user === undefined) {
        res.render('user/login', {title: 'Log in', loged_in: false, message: 'Log in before you access the notes'});
    }
    else {
        const path = PATH_PREFIX + req.body.title + PATH_SUFFIX;

        const note = new NoteModel({
            "title": path, "content": req.body.text
        })
        note.save()
            .then(() => console.log("success"))
            .catch((error) => console.log(error));
        // update user's session
        const readperm = req.session.readperm + note._id + ":";
        const writeperm = req.session.writeperm + note._id + ":";
        const prom = new Promise<void>(async (resolve, reject) => {
            await UserModel.updateOne({ "login": req.session.user }, {
                "readperm": readperm, "writeperm": writeperm
            });
            resolve()
        }).then(() => {
            req.session.readperm = readperm
            req.session.writeperm = writeperm
            req.session.save(function(err) {
                res.redirect(302, 'notes')
            })
        })
    }
};

const note_delete = (req: Request, res: Response) => {
    NoteModel.findByIdAndRemove(req.body.id, function (error: any, result: Note) {
        if (error) {
            console.log(error);
            res.redirect('/500');
        } else {
            console.log("deleted one record");
            req.session.readperm = req.session.readperm?.replace(req.body.id+":", "")
            req.session.writeperm = req.session.writeperm?.replace(req.body.id+":", "")
            req.session.save()
            res.redirect('notes'); // this does not work and because of it, app is crashing
        }
    })
};

const note_update = (req: Request, res: Response) => {
    NoteModel.findByIdAndUpdate(req.body.id, { title: req.body.title, content: req.body.content }, function (error: any, result: Note) {
        if (error) {
            console.log(error);
            res.redirect('/500');
        } else {
            console.log("great success")
            res.redirect(302, 'notes')
        }
    })
};

export default {
    note_get, note_details, note_create_get, note_create_post, note_delete, note_update
};