"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
const index_1 = __importDefault(require("./routes/index"));
app.listen(PORT, function () {
    console.log(`server listening on port ${PORT}`);
});
app.use("/order", index_1.default);
