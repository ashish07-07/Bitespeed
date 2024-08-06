"use strict";
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
function userexistance(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const email = body.email;
            const phoneNumber = body.phonenumber;
            console.log("came into 2nd middleware");
            const user = yield db_1.default.user.findMany({
                where: {
                    AND: [{ email }, { phoneNumber }],
                },
                select: {
                    email: true,
                    phoneNumber: true,
                },
            });
            console.log("printing user");
            console.log(user);
            if (user.length === 0) {
                console.log("came indide the if now as ");
                const priamaryyuser = yield db_1.default.user.findMany({
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
                console.log("priamey user hey yaar");
                console.log(priamaryyuser);
                console.log("going to if check now");
                if (priamaryyuser.length != 0) {
                    console.log("inside if check ");
                    console.log(phoneNumber);
                    let id = priamaryyuser[0].id;
                    console.log(`id hay an bhai ${id}`);
                    const second = yield db_1.default.user.create({
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
                    const a = yield db_1.default.user.findMany({
                        where: {
                            OR: [{ email }, { phoneNumber }],
                        },
                    });
                    console.log("this will be my response");
                    console.log(a);
                    const emailset = Array.from(new Set(a.map(function (val) {
                        return val.email;
                    })));
                    console.log(emailset);
                    const secondarycuser = a.filter(function (val) {
                        return val.linkedPrecedence === "secondary";
                    });
                    console.log("printing the secondary users");
                    console.log(secondarycuser);
                    const primaryuser = a.filter(function (val) {
                        return val.linkedPrecedence === "primary";
                    });
                    console.log("primary id is");
                    console.log(primaryuser[0].id);
                    const uniquephonenumber = Array.from(new Set(a.map(function (val) {
                        return val.phoneNumber;
                    })));
                    console.log(uniquephonenumber);
                    const secondaryid = Array.from(new Set(secondarycuser.map(function (val) {
                        return val.id;
                    })));
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
            }
            else {
                console.log("are nahi hua secondaty");
                next();
            }
        }
        catch (e) {
            console.error();
        }
    });
}
// async function botharepriamryuser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.log("indide the update primary middleware");
//   const body = req.body;
//   const email = body.email;
//   const phoneNumber = body.phoneNumber;
//   const priamryemailuser = await prisma.user.findFirst({
//     where: {
//       email,
//       linkedPrecedence: "primary",
//     },
//   });
//   console.log("this is one primarty user");
//   console.log(priamryemailuser);
//   let id = priamryemailuser?.id;
//   const primaryphonenumberuser = await prisma.user.findFirst({
//     where: {
//       linkedPrecedence: "primary",
//       phoneNumber,
//     },
//   });
//   console.log("this is phonenumber primary user");
//   console.log(primaryphonenumberuser);
//   console.log(primaryphonenumberuser?.id);
//   if (priamryemailuser && primaryphonenumberuser) {
//     console.log("came inside this");
//     const update = await prisma.user.update({
//       where: {
//         id: primaryphonenumberuser.id,
//       },
//       data: {
//         linkedId: priamryemailuser.id,
//         linkedPrecedence: "secondary",
//       },
//     });
//     console.log("updated successfully");
//     console.log(update);
//     // const a = await prisma.user.findMany({
//     //   where: {
//     //     // OR: [{ email }, { phoneNumber }],
//     //     linkedId: priamryemailuser.id,
//     //     OR: {
//     //       AND: [{ id: priamryemailuser.id }, { linkedPrecedence: "primary" }],
//     //     },
//     //   },
//     // });
//     const a = await prisma.user.findMany({
//       where: {
//         linkedId: primaryphonenumberuser.id,
//         OR: [
//           {
//             AND: [{ id: priamryemailuser.id }, { linkedPrecedence: "primary" }],
//           },
//         ],
//       },
//     });
//     console.log("this is the both of usser");
//     console.log(a);
//     const primaryuser = a.filter(function (val) {
//       return val.linkedPrecedence === "primary";
//     });
//     const id = primaryuser[0].id;
//     const emailset = Array.from(
//       new Set(
//         a.map(function (val) {
//           return val.createdAt;
//         })
//       )
//     );
//     console.log(emailset);
//     const phonenumberset = Array.from(
//       new Set(
//         a.map(function (val) {
//           return val.phoneNumber;
//         })
//       )
//     );
//     console.log(phonenumberset);
//     const secondaruser = a.filter(function (val) {
//       return val.linkedPrecedence === "secondary";
//     });
//     const secondaryid = Array.from(
//       new Set(
//         secondaruser.map(function (val) {
//           return val.id;
//         })
//       )
//     );
//     return res.status(201).json({
//       contracts: {
//         primaryContatctId: id,
//         emails: emailset,
//         phoneNumbers: phonenumberset,
//         secondaryContactIds: secondaryid,
//       },
//     });
//   } else {
//     console.log("both are not primary user ");
//     next();
//   }
// }
function botharepriamryuser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside the update primary middleware");
        const body = req.body;
        const email = body.email;
        const phoneNumber = body.phonenumber;
        console.log("this is the phonenumber ");
        console.log(phoneNumber);
        const priamryemailuser = yield db_1.default.user.findFirst({
            where: {
                email,
                linkedPrecedence: "primary",
            },
        });
        console.log("this is one primary user");
        console.log(priamryemailuser);
        const primaryphonenumberuser = yield db_1.default.user.findFirst({
            where: {
                phoneNumber,
                linkedPrecedence: "primary",
            },
        });
        console.log("this is phone number primary user");
        console.log(primaryphonenumberuser);
        if (priamryemailuser && primaryphonenumberuser) {
            console.log("came inside this");
            const update = yield db_1.default.user.update({
                where: {
                    id: primaryphonenumberuser.id,
                },
                data: {
                    linkedId: priamryemailuser.id,
                    linkedPrecedence: "secondary",
                },
            });
            console.log("updated successfully");
            console.log(update);
            const a = yield db_1.default.user.findMany({
                where: {
                    OR: [{ email }, { phoneNumber }],
                },
            });
            console.log("this is the both of users");
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
            const emailset = Array.from(new Set(a.map(function (val) {
                return val.email;
            })));
            console.log(emailset);
            const phonenumberset = Array.from(new Set(a.map(function (val) {
                return val.phoneNumber;
            })));
            console.log(phonenumberset);
            const secondaryuser = a.filter(function (val) {
                return val.linkedPrecedence === "secondary";
            });
            const secondaryid = Array.from(new Set(secondaryuser.map(function (val) {
                return val.id;
            })));
            return res.status(201).json({
                contact: {
                    primaryContactId: id,
                    emails: emailset,
                    phoneNumbers: phonenumberset,
                    secondaryContactIds: secondaryid,
                },
            });
        }
        else {
            console.log("both are not primary user");
            next();
        }
    });
}
router.post("/identify", userNOexistance, botharepriamryuser, userexistance, function (req, res) {
    console.log("CONTROL REACHED TO THE MAIN ROUTER");
    res.send("hello man wts up");
});
exports.default = router;
