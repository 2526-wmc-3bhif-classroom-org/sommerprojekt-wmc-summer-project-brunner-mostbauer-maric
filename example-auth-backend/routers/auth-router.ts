import express from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User, users } from "../data/user-store";
import { isAdmin, isAuthenticated, SECRET_KEY } from "../middleware/auth-handlers";
import bcrypt from 'bcrypt';

// create router
export const authRouter = express.Router();

export interface UserCredentials {
    email: string,
    password: string,
}

// return all users
authRouter.get("/users", (request, response) => {
    response.status(StatusCodes.OK).json(users);
});

// login - unprotected route
authRouter.post("/login", (request, response) => {
    const loginUser: UserCredentials = request.body;
    const user = users.find(u => u.email === loginUser.email);
    if (user === undefined) {
        response.status(StatusCodes.UNAUTHORIZED).json('User does not exist');
        return;
    }

    if (!bcrypt.compareSync(loginUser.password, user.password)) {
        response.status(StatusCodes.UNAUTHORIZED).json('Wrong password');
        return;
    }
    const userClaims = {
        email: user.email,
        role: user.role
    };
    const token = jwt.sign({
        user: userClaims
    }, SECRET_KEY, {
        expiresIn: '30m'
    });
    const { exp } = jwt.decode(token) as {
        exp: number;
    };
    const expires = new Date(exp * 1000);
    response.status(StatusCodes.OK).json({
        user: userClaims,
        expiresAt: expires,
        message: "Login successfull",
        accessToken: token
    });
});

