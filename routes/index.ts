import { Router, Request, Response } from "express";

export const indexRoute = Router();

indexRoute.get("/", (req: Request, res: Response) => {
  res.render('index', { title: 'Bun.js Express Server' });
});
