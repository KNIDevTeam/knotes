const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    //zrobić listę obiektów postaci {note_id(niew weim jaki typ), allow_write(bool)}
}, {timestamps: true})

const Note  = mongoose.model('users', userSchema);

module.exports = User;