import express from "express";
import { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

import mainrouter from "./routes/index";

app.use("/order", mainrouter);

// app.get("*", (req, res) => {
//   res.status(404).send("Not Found");
// });

app.get("/", function (req: Request, res: Response) {
  res.send({
    Name: "B ASHISH KARAGOND",
    SKILLS:
      "Next.js,React.js,Node.js,Express, Typescript,Javascript,Redis,Docker,Postgresql,Prisma,Kubernatives-currently learning ",
  });
});

app.listen(PORT, function () {
  console.log(`server listening on port ${PORT}`);
});
