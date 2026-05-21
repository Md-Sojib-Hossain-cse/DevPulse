import express, { type Request, type Response } from "express";
import notFound from "./utility/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world!",
  });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
