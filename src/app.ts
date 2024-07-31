import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json());

dotenv.config({ path: ".env" });

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://to-do-frontend-kw4v.vercel.app", // Production frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies to be sent
  })
);

app.options("*", cors());

app.use(helmet());

const limiter = rateLimit({
  max: 10000,
  windowMs: 6 * 60 * 1000,
  message: "Too many requests from this IP . Please try again later",
});

app.use("/api", limiter);

app.use(mongoSanitize());

app.use(
  hpp({
    whitelist: [],
  })
);

app.use(compression());

app.use("/api/", routes());

export default app;
