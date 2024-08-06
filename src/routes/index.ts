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
    const body = req.body;
    const email = body.email;
    const phoneNumber = body.phonenumber;

    console.log("came into 2nd middleware");
    const user = await prisma.user.findMany({
      where: {
        AND: [{ email }, { phoneNumber }],
      },
      select: {
        email: true,
        phoneNumber: true,
      },
    });

    console.log(user);
    if (user.length === 0) {
      const priamaryyuser = await prisma.user.findMany({
        where: {
          linkedPrecedence: "primary",
          AND: {
            OR: [{ email }, { phoneNumber }],
          },
        },
        select: {
          id: true,
        },
      });
      console.log("priamey user details ");
      console.log(priamaryyuser);

      if (priamaryyuser.length != 0) {
        console.log(phoneNumber);
        let id = priamaryyuser[0].id;
        console.log(`id is  ${id}`);

        const second = await prisma.user.create({
          data: {
            phoneNumber,
            email,
            linkedId: id,
            linkedPrecedence: "secondary",
          },
          select: {
            phoneNumber: true,
            email: true,
            id: true,
          },
        });

        console.log(second);

        const a = await prisma.user.findMany({
          where: {
            OR: [{ email }, { phoneNumber }],
          },
        });

        console.log(a);

        const emailset = Array.from(
          new Set(
            a.map(function (val) {
              return val.email;
            })
          )
        );

        console.log(emailset);

        const secondarycuser = a.filter(function (val) {
          return val.linkedPrecedence === "secondary";
        });
        console.log(" secondary users");
        console.log(secondarycuser);

        const primaryuser = a.filter(function (val) {
          return val.linkedPrecedence === "primary";
        });

        console.log("primary id is");
        console.log(primaryuser[0].id);

        const uniquephonenumber = Array.from(
          new Set(
            a.map(function (val) {
              return val.phoneNumber;
            })
          )
        );

        console.log(uniquephonenumber);

        const secondaryid = Array.from(
          new Set(
            secondarycuser.map(function (val) {
              return val.id;
            })
          )
        );

        console.log(secondaryid);

        return res.status(201).json({
          contracts: {
            primaryContatctId: primaryuser[0].id,
            emails: emailset,
            phoneNumbers: uniquephonenumber,
            secondaryContactIds: secondaryid,
          },
        });
      }
    } else {
      console.log("secondary user failed ");
      next();
    }
  } catch (e) {
    console.error();
  }
}

async function botharepriamryuser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("conrol reached to  primaryuser  middleware");
  const body = req.body;
  const email = body.email;
  const phoneNumber = body.phonenumber;

  console.log("phonenumber");

  console.log(phoneNumber);

  const priamryemailuser = await prisma.user.findFirst({
    where: {
      email,
      linkedPrecedence: "primary",
    },
  });

  console.log("primary user with that partucular email ");
  console.log(priamryemailuser);

  const primaryphonenumberuser = await prisma.user.findFirst({
    where: {
      phoneNumber,
      linkedPrecedence: "primary",
    },
  });

  console.log("primary user with that particualr phonenumber");
  console.log(primaryphonenumberuser);

  if (priamryemailuser && primaryphonenumberuser) {
    console.log("came inside this");
    const update = await prisma.user.update({
      where: {
        id: primaryphonenumberuser.id,
      },
      data: {
        linkedId: priamryemailuser.id,
        linkedPrecedence: "secondary",
      },
    });

    console.log("updated  the database successfully");
    console.log(update);

    const a = await prisma.user.findMany({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    console.log("users with email and password");
    console.log(a);

    const primaryuser = a.filter(function (val) {
      return val.linkedPrecedence === "primary";
    });

    if (primaryuser.length === 0) {
      console.error("No primary user found");
      return res.status(500).json({
        error: "No primary user found",
      });
    }

    const id = primaryuser[0].id;

    const emailset = Array.from(
      new Set(
        a.map(function (val) {
          return val.email;
        })
      )
    );

    console.log(emailset);
    const phonenumberset = Array.from(
      new Set(
        a.map(function (val) {
          return val.phoneNumber;
        })
      )
    );

    console.log(phonenumberset);

    const secondaryuser = a.filter(function (val) {
      return val.linkedPrecedence === "secondary";
    });

    const secondaryid = Array.from(
      new Set(
        secondaryuser.map(function (val) {
          return val.id;
        })
      )
    );

    return res.status(201).json({
      contact: {
        primaryContactId: id,
        emails: emailset,
        phoneNumbers: phonenumberset,
        secondaryContactIds: secondaryid,
      },
    });
  } else {
    console.log("both are not primary user");
    next();
  }
}

router.post(
  "/identify",
  userNOexistance,
  botharepriamryuser,
  userexistance,
  function (req, res) {
    console.log("CONTROL REACHED TO THE MAIN ROUTER");
    res.send("finished entering all the middlewares");
  }
);

export default router;
