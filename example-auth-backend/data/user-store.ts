import bcrypt from 'bcrypt';

export interface User {
    email: string,
    password: string,
    fullName: string,
    role: string,
}

const saltRounds = 8

// simulate a user data storage
export const users: User[] = [
    {
        fullName: 'Administrator',
        email: 'admin@fruits.at',
        role: 'admin',
        password: bcrypt.hashSync('pw4admin', saltRounds)
    },
    {
        fullName: 'John Doe',
        email: 'john@doe.at',
        role: 'user',
        password: bcrypt.hashSync('pw4user', saltRounds)
    }
];