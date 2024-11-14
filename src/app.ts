import express, { Application, Request, Response, NextFunction } from "express";
import { userRoute } from "./routes";
import { multerErrorHandler } from "./middlewares";

const app: Application = express();

// Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", userRoute);

app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    message: "Not Found",
  });
});

// Error Handling Middleware
app.use(multerErrorHandler);

const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
