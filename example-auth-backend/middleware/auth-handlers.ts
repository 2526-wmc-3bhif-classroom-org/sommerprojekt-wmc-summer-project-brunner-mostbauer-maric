import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY = 'your-very-secret-key';

export interface AuthRequest extends Request {
    payload: JwtPayload;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            // header does not even contain a Bearer token => respond with Unauthorized
            throw new Error("No bearer token available");
        }

        // check if the token is valid => otherwise an error is thrown
        const decoded: string | JwtPayload = jwt.verify(token, SECRET_KEY);
        (req as AuthRequest).payload = (decoded as JwtPayload);

        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the jwt payload contains an admin role
        const payload = (req as AuthRequest).payload;
        if (payload.user.role === 'admin') {
            next();
        }
        else {
            res.status(401).send('Admin role required');
        }
    } catch (err) {
        // the request has not been authorized before
        res.status(401).send('Authentication required');
    }
}
