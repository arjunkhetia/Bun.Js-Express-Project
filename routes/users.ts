import { Router, Request, Response } from "express";

export const usersRoute = Router();

usersRoute.post("/", (req: Request, res: Response) => {
  res.send("Users response.");
});
