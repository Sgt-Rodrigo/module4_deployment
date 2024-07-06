import { NextFunction, Request, Response } from "express";


export function logger (req:Request, res: Response, next: NextFunction) {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    console.log('Route: ', req.url);
    console.log('Method:', req.method);
    console.log('Date & Time: ', date, time)
    next();
}