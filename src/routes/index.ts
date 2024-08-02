import express, { NextFunction } from "express";
import { Request, Response } from "express";

const router = express.Router();

router.use(express.json());

interface User {
  email?: string;
  phonenumber?: string;
}

async function Checker(req: Request, res: Response, next: NextFunction) {
  const body = await req.body;
  const email = body.email;
  const number = body.phonenumber;

  console.log(email);
  console.log(number);

  next();
}

function userexists(req: Request, res: Response, next: NextFunction) {}
router.post("/identify", Checker, function (req, res) {
  console.log("CONTROL REACHED TO THE MAIN ROUTER");

  res.send("hello man wts up ");
});

export default router;
