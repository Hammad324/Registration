import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "../src/routes/user.routes.js"

export const app = express();

app.use(cookieParser());
app.use(express.json({limit: "16kb"}));

app.use("/api/v1/user", userRouter);