import express from "express";
import { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

import mainrouter from "./routes/index";

app.use("/order", mainrouter);

app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, function () {
  console.log(`server listening on port ${PORT}`);
});
