import express, { type Request, type Response } from "express";
import notFound from "./utility/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { issueRoutes } from "./modules/issues/issues.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  }),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to DevPulse!",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/issues", issueRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
