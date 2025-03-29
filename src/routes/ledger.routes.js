import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    allLedgers,
    createLedger,
    updateLedger,
} from "../controllers/ledgers.controllers.js";

const router = Router();

router.route("/create").post(verifyJWT, createLedger);
router.route("/allLedgers").post(verifyJWT, allLedgers);
router.route("/update").post(verifyJWT, updateLedger);

export default router;
