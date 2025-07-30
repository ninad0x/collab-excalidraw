import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";


export function userMiddleware(req: Request, res: Response, next: NextFunction) {

    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded) {
        return res.status(403).json({
            message: "Unauthorized"
        })
    } else {
        // @ts-ignore
        req.userId = decoded.userId;
        next()
    }
}