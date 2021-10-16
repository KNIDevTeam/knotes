import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

export interface User {
    login: string
    password: string
    readperm?: string
    writeperm?: string
}

const schema = new Schema<User>({
    login: { type: String, required: true },
    password: { type: String, required: true },
    readperm: String,
    writeperm: String
}, { timestamps: true })

export const UserModel = model<User>('users', schema)
