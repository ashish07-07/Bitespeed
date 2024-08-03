import express, { NextFunction, Request, Response } from "express";
import prisma from "../db";

const router = express.Router();
router.use(express.json());

interface User {
  email?: string;
  phonenumber?: string;
}

async function userNOexistance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, phonenumber: number } = req.body;

    if (!email && !number) {
      return res.status(400).json({ msg: "Email or phone number is required" });
    }

    console.log(email);
    console.log(number);

    const users = await prisma.user.findMany({
      where: {
        OR: [{ email }, { phoneNumber: number }],
      },
    });

    console.log(users);

    if (users.length === 0) {
      try {
        const newUser = await prisma.user.create({
          data: {
            phoneNumber: number,
            email: email,
            linkedId: null,
            linkedPrecedence: "primary",
          },
        });

        return res.status(202).json({
          msg: "User created successfully",
          user: newUser,
        });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Error creating user" });
      }
    } else {
      console.log("User already exists");
      next();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

async function userexistance(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, phoneNumber } = req.body;
    const user = await prisma.user.findMany({
      where: {
        AND: [{ email }, { phoneNumber }],
      },
    });
    let id;
    if (user.length === 0) {
      const uncommon = await prisma.user.findMany({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });
    } else {
    }
  } catch (e) {
    console.error();
  }
}

router.post("/identify", userNOexistance, userexistance, function (req, res) {
  console.log("CONTROL REACHED TO THE MAIN ROUTER");
  res.send("hello man wts up");
});

export default router;
