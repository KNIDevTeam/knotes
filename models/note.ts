import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

export interface Note {
    title: string
    content?: string
}

const schema = new Schema<Note>({
    title: { type: String, required: true },
    content: String
}, {timestamps: true})

export const NoteModel = model<Note>('users-notes', schema);
