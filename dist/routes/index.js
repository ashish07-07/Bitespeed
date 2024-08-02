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
const router = express_1.default.Router();
router.use(express_1.default.json());
function Checker(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield req.body;
        const email = body.email;
        const number = body.phonenumber;
        console.log(email);
        console.log(number);
        next();
    });
}
function userexists(req, res, next) { }
router.post("/identify", Checker, function (req, res) {
    console.log("CONTROL REACHED TO THE MAIN ROUTER");
    res.send("hello man wts up ");
});
exports.default = router;
