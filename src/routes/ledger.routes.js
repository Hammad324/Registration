import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createLedger } from "../controllers/ledgers.controllers.js";

const router = Router();

router.route("/create").post(verifyJWT, createLedger);

export default router;
