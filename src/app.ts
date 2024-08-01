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

const corsOptions = {
  origin: "https://to-do-frontend-kw4v.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet());
app.set("trust proxy", 1);

const limiter = rateLimit({
  max: 10000,
  windowMs: 6 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later",
});

app.use("/api", limiter);
app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(compression());

app.use("/api", routes());

export default app;
