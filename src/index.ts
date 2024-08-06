import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

import mainrouter from "./routes/index";

app.use("/order", mainrouter);

app.listen(PORT, function () {
  console.log(`server listening on port ${PORT}`);
});

// app.use("/order", mainrouter);
