import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../models/types.js';

export const SECRET_KEY = process.env.JWT_SECRET || 'your-very-secret-key';

export interface AuthPayload extends jwt.JwtPayload {
    user: {
        UserId: number;
        Email: string;
        Role: UserRole;
    }
}

export interface AuthRequest extends Request {
    payload?: AuthPayload;
}

/**
 * Middleware to check if the user is authenticated via JWT.
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: "No bearer token available" } });
            return;
        }

        const decoded = jwt.verify(token, SECRET_KEY) as AuthPayload;
        (req as AuthRequest).payload = decoded;

        next();
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: `Please authenticate! ${err}` } });
    }
};

/**
 * Middleware to check if the authenticated user has an admin role.
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = (req as AuthRequest).payload;
        if (payload?.user.Role === UserRole.ADMIN) {
            next();
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ error: { message: 'Admin role required' } });
        }
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: 'Authentication required' } });
    }
};
