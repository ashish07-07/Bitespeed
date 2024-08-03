"use strict";
// import express, { NextFunction } from "express";
// import { Request, Response } from "express";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// import prisma from "../db";
// router.use(express.json());
// interface User {
//   email?: string;
//   phonenumber?: string;
// }
// async function userNOexistance(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const body = await req.body;
//     const email = body.email;
//     const number = body.phonenumber;
//     console.log(email);
//     console.log(number);
//     const user = await prisma.user.findMany({
//       where: {
//         OR: [{ email: email }, { phoneNumber: number }],
//       },
//     });
//     console.log(user);
//     if (user.length === 0) {
//       try {
//         const users = await prisma.user.create({
//           data: {
//             phoneNumber: number,
//             email: email,
//             linkedId: null,
//             linkedPrecedence: "primary",
//           },
//         });
//         return res.status(202).json({
//           msg: "user created successfully",
//           users,
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     } else {
//       console.log("it reached here mam");
//       next();
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }
// router.post("/identify", userNOexistance, function (req, res) {
//   console.log("CONTROL REACHED TO THE MAIN ROUTER");
//   res.send("hello man wts up ");
// });
// export default router;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
router.use(express_1.default.json());
function userNOexistance(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, phonenumber: number } = req.body;
            if (!email && !number) {
                return res.status(400).json({ msg: "Email or phone number is required" });
            }
            console.log(email);
            console.log(number);
            const users = yield db_1.default.user.findMany({
                where: {
                    OR: [{ email }, { phoneNumber: number }],
                },
            });
            console.log(users);
            if (users.length === 0) {
                try {
                    const newUser = yield db_1.default.user.create({
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
                }
                catch (e) {
                    console.error(e);
                    return res.status(500).json({ msg: "Error creating user" });
                }
            }
            else {
                console.log("User already exists");
                next();
            }
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ msg: "Internal server error" });
        }
    });
}
router.post("/identify", userNOexistance, function (req, res) {
    console.log("CONTROL REACHED TO THE MAIN ROUTER");
    res.send("hello man wts up");
});
exports.default = router;
