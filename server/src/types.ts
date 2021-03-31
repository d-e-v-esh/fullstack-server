import { Request, Response } from "express";
import session from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request & { session?: session.Session & Partial<session.SessionData> };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
};
