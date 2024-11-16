import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { userRoute } from "./routes";
import { multerErrorHandler, globalErrorHandler } from "./middlewares";

const app: Application = express();

// Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/user", userRoute);

// Not Found Route
app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    message: "Not Found",
  });
});

// Error Handling Middleware
app.use(multerErrorHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Server Configuration
const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
